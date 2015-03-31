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
 * Constructor Folder to define home(base) directory.
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

function isOutside(dir) {
    var basename = path.basename(this.home);

    var resolve = path.resolve(this.home, path.join(this.home, dir)).substring(this.home.length-basename.length);

    if(S(resolve).contains(basename) === false) {
        var error  = new Error("Permission denied to access folder outside home.");
        error.code = "ENOPERM";

        throw error;
    }
}

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

    try {
        var readStream  = fs.createReadStream(from);
        var writeStream = fs.createWriteStream(to);

        writeStream.on("finish", function() {
            done.call(this, {from: from, to: to}, next);
        });

        readStream.pipe(writeStream);
    } catch(e) {
        fs.unlinkSync(to);

        done.call(this, e, next);
    }
};

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
        var result = error ? error : {from: from, to: to};

        done.call(self, result, next);
    }));
};

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

Local.prototype.search = function(search) {
    var find = [];

    if(this.files && this.files.hasOwnProperty('files')) {
        find = _.filter(this.files.files, function(item){

            if(S(item.name).contains(search)) {
                return item;
            }
        });
    }

    return find;
};

Local.prototype.sortBy = function(sort) {
    var find = [];

    if(this.files && this.files.hasOwnProperty('files')) {
        find = _.sortBy(this.files.files.name, 'sort');
    }

    return find;
};
/**
 *
 * ----------------------------------------------------------------------------
 * deprecated
 * ----------------------------------------------------------------------------
 */

/*function stream(src, dst, next) {
    if(typeof next !== 'function') {
        throw new Error("Third argument have to be a callback function.");
    }

    var readStream = fs.createReadStream(src);
    var writeStream = fs.createWriteStream(dst);

    try {
        readStream.on("error", function(err) {
            readStream.destroy();

            fs.unlinkSync(dst);

            done(err);
        });

        writeStream.on("error", function(err) {
            fs.unlinkSync(dst);

            done(err);
        });

        writeStream.on("finish", function() {
            done(null);
        });

        readStream.pipe(writeStream);
    } catch(e) {
        done(e);
    }


    function done(err) {
        if(err) {
            next(err, null);

            return;
        }

        process.nextTick(function() {
            next(null, {from: src, to: dst});
        });
    }
}
*/

module.exports = Local;