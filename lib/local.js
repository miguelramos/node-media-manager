"use strict";

/**
 *
 * ----------------------------------------------------------------------------
 * folder.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var fs     = require('fs'),
    util   = require('util'),
    path   = require('path'),
    mime   = require('./mime'),
    events = require('events'),
    S      = require('string'),
    utils  = require('./utils'),
    _      = require('underscore');

/**
 * Constructor Local to define home(base) directory.
 *
 * @param {string} home Base directory
 */
function Local(home) {
    events.EventEmitter.call(this);

    this.domain = require('domain').create();

    if(!home) {
        throw new Error("Please provide your home folder!");
    }

    this.files = {};
    this.home  = home;
}

util.inherits(Local, events.EventEmitter);

/**
 * Function treat errors.
 *
 * @param  {Function} next Callback function
 * @return {void}
 */
function errorHandler(next) {
    return function(error, result) {
        process.nextTick(function() {
            if(error) {
                next(error, null);
            } else {
                next(null, result);
            }
        });
    };
}

/**
 * Function to treat response from methods.
 *
 * @param  {mixed}   result  Any kind
 * @param  {Function} cb     Callback function
 * @return {Function}
 */
function done(result, cb) {
    var error = (result instanceof Error);

    process.nextTick(function() {
        if(typeof cb === 'function') {
            if(error) {
                cb(result, null);
            } else {
                cb(null, result);
            }
        } else if(this && this['_events']) {
            if(error) {
                this.emit('error', result);
            } else {
                this.emit('finish', result);
            }

            this.removeAllListeners();
            this.domain.exit();
        } else {
            var err  = new Error('No handler present to pass result.');
            err.code = "ENOHANDLER";

            throw err;
        }
    }.bind(this));
}

/**
 * Function to check if operations are done thru home directory.
 *
 * @param  {string}  dir Relative path
 * @return {void}
 */
function isOutside(dir) {
    var basename = path.basename(this.home);

    var resolve = path.resolve(this.home, path.join(this.home, dir)).substring(this.home.length-basename.length);

    if(S(resolve).contains(basename) === false) {
        var error  = new Error("Permission denied to access folder outside home.");
        error.code = "ENOPERM";

        throw error;
    }
}

/**
 * Method to open directory and list is contents.
 *
 * @param  {string}   relative Relative path
 * @param  {Function} next     Callback function
 * @return {void}
 */
Local.prototype.open = function(relative, next) {
    var self      = this,
        directory = path.resolve(this.home, path.join(this.home, relative));

    try {
        isOutside.call(this, relative);
    } catch(e) {
        done.call(this, e, next);

        return;
    }

    this.parent   = (path.relative(directory, this.home).length === 0) ? "/" : path.relative(directory, this.home);
    this.relative = (path.relative(this.home, directory).length === 0) ? "/" : path.relative(this.home, directory);
    this.current  = directory;

    var _open = function(files) {
        for (var i = 0; i < files.length; ++i) {
            var filepath = path.join(directory, files[i]);

            files[i] = mime.stat(filepath);

            if(files[i].hasOwnProperty('path')) {
                files[i].relative = path.relative(self.home, files[i].path);
            }
        }

        return self.files = {
            list     : files,
            template : utils.template(files).join('\n'),
            paths    : {
                home    : self.home,
                current : self.current,
                relative: self.relative,
                parent  : self.parent
            }
        };
    };

    fs.readdir(directory, errorHandler(function(error, files){

        var result = error ? error : _open(files);

        done.call(self, result, next);
    }));
};

/**
 * Method to add a file.
 *
 * @param {string}   src  Relative source path
 * @param {string}   to   Relative destination path
 * @param {Function} next Callback function
 */
Local.prototype.add = function(src, to, next) {
    var self     = this,
        basename = path.basename(src, path.extname(src)),
        filename = S(basename).slugify().s;

    try {
        isOutside.call(this, to);
    } catch(e) {
        done.call(this, e, next);

        return;
    }

    var destination = path.resolve(this.home, path.join(this.home, to, (filename+'.'+path.extname(src).substr(1))));

    var _write = function(data) {
        fs.writeFile(destination, data, errorHandler(function (error, undefined) {
            var result = error ? error : {
                'name': filename,
                'path': destination,
                'ext' : path.extname(src).substr(1),
                'rel' : to
            };

            done.call(self, result, next);
        }));
    };

    fs.readFile(src, errorHandler(function (error, data){
        if(error) {
            done.call(self, error, next);

            return;
        }

        process.nextTick(function(){
            _write(data);
        });
    }));
};

/**
 * Method to create directory.
 *
 * @param  {string}   relative Relative path
 * @param  {string}   mode     Directory permissions
 * @param  {Function} next     Callback function
 * @return {void}
 */
Local.prototype.create = function(relative, mode, next){
    var directory = path.resolve(this.home, path.join(this.home, relative)),
        self      = this;

    if(!mode) {
        mode = '0777';
    }

    try {
        isOutside.call(this, relative);
    } catch(e) {
        done.call(this, e, next);

        return;
    }

    fs.mkdir(directory, mode, errorHandler(function(error, undefined){
        var result = error ? error : directory;

        done.call(self, result, next);
    }));
};

/**
 * Method to delete directory/file.
 *
 * @param  {string}   relative Relative path
 * @param  {Function} next     Callback function
 * @return {void}
 */
Local.prototype.remove = function(relative, next) {
    var absolute = path.resolve(this.home, path.join(this.home, relative)),
        self     = this;

    try {
        isOutside.call(this, relative);
    } catch(e) {
        done.call(this, e, next);

        return;
    }

    var _rmDir = function(directory) {
        fs.rmdir(directory, errorHandler(function(error, undefined){
            var result = error ? error : directory;

            done.call(self, result, next);
        }));
    };

    var _remove = function() {
        fs.unlink(absolute, errorHandler(function(error, undefined){
            var result = error ? error : absolute;

            done.call(self, result, next);
        }));
    };

    fs.lstat(absolute, function(error, stat){
        if(error) {
            done.call(self, error, next);

            return;
        }

        process.nextTick(function(){
            if(stat.isDirectory()) {
                _rmDir(absolute);
            } else {
                _remove();
            }
        });
    });
};

/**
 * Method to copy file.
 *
 * @param  {string}   src  Relative source path
 * @param  {string}   dst  Relative destination path
 * @param  {Function} next Callback function
 * @return {void}
 */
Local.prototype.copy = function(src, dst, next) {
    var from = path.resolve(this.home, path.join(this.home, src)),
        to   = path.resolve(this.home, path.join(this.home, dst)),
        self = this;

    try {
        isOutside.call(this, src);
        isOutside.call(this, dst);
    } catch(e) {
        done.call(this, e, next);

        return;
    }

    var _clean = function(result) {
        if(result instanceof Error) {
            fs.unlinkSync(to);
        }

        process.nextTick(function(){
            done.call(self, result, next);
        });
    };

    var readStream  = fs.createReadStream(from);
    var writeStream = fs.createWriteStream(to);

    readStream.on('data', function(data) {
        writeStream.write(data);
    });

    readStream.on('end', function() {
        writeStream.end();
        _clean({from: from, to: to});
    });

    readStream.on('error', function(error) {
        writeStream.close();
        _clean(error);
    });
};

/**
 * Method to move directory/file.
 *
 * @param  {string}   from Relative source path
 * @param  {string}   to   Relative destination path
 * @param  {Function} next Callback function
 * @return {void}
 */
Local.prototype.move = function(from, to, next) {
    var src  = path.resolve(this.home, path.join(this.home, from)),
        dst  = path.resolve(this.home, path.join(this.home, to)),
        self = this;

    try {
        isOutside.call(this, from);
        isOutside.call(this, to);
    } catch(e) {
        done.call(this, e, next);

        return;
    }

    fs.rename(src, dst, errorHandler(function(error, undefined){
        var result = error ? error : {from: src, to: dst};

        done.call(self, result, next);
    }));
};

/**
 * Method to create symbolic link to directory/file.
 *
 * @param  {string}   src  Relative source path
 * @param  {string}   dst  Relative destination path
 * @param  {Function} next Callback function
 * @return {void}
 */
Local.prototype.link = function(src, dst, next) {
    var from = path.resolve(this.home, path.join(this.home, src)),
        to   = path.resolve(this.home, path.join(this.home, dst)),
        self = this;

    try {
        isOutside.call(this, src);
        isOutside.call(this, dst);
    } catch(e) {
        done.call(this, e, next);

        return;
    }

    fs.symlink(from, to, errorHandler(function(error, undefined){
        var result = error ? error : {from: from, to: to};

        done.call(self, result, next);
    }));
};

/**
 * Method to search for file or directory.
 *
 * @param  {string} search Name, extension etc
 * @return {array}         Result array
 */
Local.prototype.search = function(search) {
    var find = [];

    if(this.files && this.files.hasOwnProperty('list')) {
        find = _.filter(this.files.list, function(item){

            if(S(item.name).contains(search)) {
                return item;
            }
        });
    }

    return find;
};

/**
 * Method to sort files/directories
 *
 * @param  {string} sort Sort by extension, name
 * @return {array}       Result array.
 */
Local.prototype.sortBy = function(sort) {
    var find = [];

    if(this.files && this.files.hasOwnProperty('list')) {
        find = _.sortBy(this.files.list, sort);
    }

    return find;
};

module.exports = Local;