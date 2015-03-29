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

    if(!home) {
        throw new Error("Please provide your home folder!");
    }

    this.files = {};
    this.home  = home;
}

util.inherits(Local, events.EventEmitter);

/**
 * Method to open and list contents.
 *
 * @param  {string}   dir Directory to list
 * @param  {Function} cb  Callback function
 * @return {void}
 */
Local.prototype.open = function(dir, cb) {
    var self      = this,
        directory = path.resolve(this.home, path.join(this.home, dir));

    if(this.isOutside(dir)) {
        var err = new Error("Permission denied to access folder outside home.");

        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(err, null);
            });
        } else {
            this.emit('onRead', err, null);
        }

        return;
    }

    this.parent   = (path.relative(directory, this.home).length === 0) ? "/" : path.relative(directory, this.home);
    this.relative = (path.relative(this.home, directory).length === 0) ? "/" : path.relative(this.home, directory);

    if(!this.hasOwnProperty('current')) {
        this.current = directory;
    }

    fs.readdir(directory, function(error, files) {
        if (error) {
            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(error, null);
                });
            } else {
                self.emit('onRead', error, null);
            }
        } else {
            for (var i = 0; i < files.length; ++i) {
                var filepath = path.join(directory, files[i]);

                files[i] = mime.stat(filepath);

                if(files[i].hasOwnProperty('path')) {
                    files[i].relative = path.relative(self.home, files[i].path);//files[i].path.substring(self.home.length);
                }
            }

            self.files = {
                files   : files,
                template: utils.template(files).join('\n'),
                paths   : {
                    home    : self.home,
                    current : self.current,
                    relative: self.relative,
                    parent  : self.parent
                }
            };

            self.emit('onRead', null, self.files);

            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(null, self.files);
                });
            }
        }
    });
};

/**
 * Method to add files to home directory or their to their childrens.
 *
 * @param {string}   filepath File path
 * @param {string}   to       Relative destination
 * @param {string}   name     Optional new name file
 * @param {Function} cb       Callback function
 */
Local.prototype.add = function(filepath, to, name, cb) {
    var self     = this,
        filename = name ? S(path.basename(name, path.extname(name))).slugify().s : S(path.basename(filepath, path.extname(filepath))).slugify().s;

    if(this.isOutside(to)){
        var err = new Error("Permission denied to access folder outside home.");

        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(err, null);
            });
        } else {
            this.emit('onReadFile', err, null);
        }

        return;
    }

    var destination = path.resolve(this.home, path.join(this.home, to, (filename+'.'+path.extname(filepath).substr(1))));

    var _writeFile = function(data) {
        fs.writeFile(destination, data, function (err) {
            if(err) {
                if(typeof cb === 'function') {
                    process.nextTick(function() {
                        cb(err, null);
                    });
                } else {
                    self.emit('onAddFile', err, null);
                }
            } else {
                var result = {
                    'name': filename,
                    'path': destination,
                    'ext' : path.extname(filepath).substr(1),
                    'rel' : to
                };

                self.emit('onAddFile', null, result);

                if(typeof cb === 'function') {
                    process.nextTick(function() {
                        cb(null, result);
                    });
                }
            }
        });
    };

    fs.readFile(filepath, function (error, data) {
        if(error) {
            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(error, null);
                });
            } else {
                self.emit('onReadFile', error, null);
            }
        } else {
            self.emit('onReadFile', null, data);

            process.nextTick(function() {
                _writeFile(data);
            });
        }
    });
};

Local.prototype.remove = function(relativePath, cb) {
    var absolute = path.resolve(this.home, path.join(this.home, relativePath)),
        self     = this;

    var _deleteFile = function() {
        fs.unlink(absolute, function(err){
            if(error) {
                if(typeof cb === 'function') {
                    cb(err, null);
                } else {
                    self.emit('onRemove', err, null);
                }

                return;
            }

            self.emit('onRemove', null, absolute);

            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(null, absolute);
                });
            }
        });
    };

    fs.stat(absolute, function(error, stat){
        if(error) {
            if(typeof cb === 'function') {
                cb(error, null);
            } else {
                self.emit('onRemove', error, null);
            }

            return;
        }

        process.nextTick(function(){
            if(stat.isDirectory()) {
                self.rmdir(relativePath, cb);
            } else {
                _deleteFile();
            }
        });
    });
};

Local.prototype.move = function(from, to, cb) {
    var oldPath = path.resolve(this.home, path.join(this.home, from)),
        newPath = path.resolve(this.home, path.join(this.home, to));

    var _moveDir = function() {
        fs.rename(oldPath, newPath, function(error){
            if(error) {
                if(typeof cb === 'function') {
                    cb(error, null);
                } else {
                    self.emit('onMove', error, null);
                }

                return;
            }

            self.emit('onMove', null, {from: oldPath, to: newPath});

            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(null, {from: oldPath, to: newPath});
                });
            }
        });
    };

    var _moveFile = function() {
        var readStream = fs.createReadStream(oldPath);

        readStream.on("error", function(err) {
            readStream.destroy();

            done(err);
        });

        var writeStream = fs.createWriteStream(newPath);

        writeStream.on("error", function(err) {
            done(err);
        });

        writeStream.on("close", function(ex) {
            //done();
        });

        readStream.pipe(writeStream);

        function done(err) {
            if(typeof cb === 'function') {
                cb(err, null);
            } else {
                self.emit('onMove', err, null);
            }
        }
    };

    fs.stat(oldPath, function(error, stat){
        if(error) {
            if(typeof cb === 'function') {
                cb(error, null);
            } else {
                self.emit('onMove', error, null);
            }

            return;
        }

        process.nextTick(function(){
            if(stat.isDirectory()) {
                _moveDir();
            } else {
                _moveFile();
            }
        });
    });
};

Local.prototype.link = function() {

};

/**
 * Method to create directory.
 *
 * @param  {string}   dir  Directory name
 * @param  {integer}  mode Octal mode
 * @param  {Function} cb   Callback function
 * @return {void}
 */
Local.prototype.mkdir = function(dir, mode, cb) {
    var directory = path.resolve(this.home, path.join(this.home, dir)),
        self      = this;

    if(!mode) {
        mode = '0777';
    }

    fs.mkdir(directory, mode, function(err){
        if(typeof cb === 'function') {
            process.nextTick(function() {
                err ? cb(err, null) : cb(null, directory);
            });
        } else {
            err ? self.emit('onMkdir', err, null) : self.emit('onMkdir', null, directory);
        }
    });
};

/**
 * Method to delete a directory.
 *
 * @param  {string}   dir Directory name
 * @param  {Function} cb  Callback function
 * @return {void}
 */
Local.prototype.rmdir = function(dir, cb) {
    var directory = path.resolve(this.home, path.join(this.home, dir)),
        self      = this;

    fs.rmdir(directory, function(err){
        if(typeof cb === 'function') {
            process.nextTick(function() {
                err ? cb(err, null) : cb(null, directory);
            });
        } else {
            err ? self.emit('onRmdir', err, null) : self.emit('onRmdir', null, directory);
        }
    });
};

/**
 * Check if folder to list is outside home dir.
 *
 * @param  {String}  dir Relative path dir
 * @return {Boolean}     True or False
 */
Local.prototype.isOutside = function(dir) {
    var basename = path.basename(this.home);

    var resolve = path.resolve(this.home, path.join(this.home, dir)).substring(this.home.length-basename.length);//path.resolve(this.home, path.join(this.home, dir));

    return S(resolve).contains(basename) ? false : true;
};

/**
 * Method to find files or folder in current open directory.
 *
 * @param  {string} search  Folder name or file or extension
 * @return {null or object} Result
 */
Local.prototype.find = function(search) {
    var find = null;

    if(this.files.hasOwnProperty('files')) {
        find = _.find(this.files.files, function(item){

            if(S(item.name).contains(search)) {
                return item;
            }
        });
    }

    return find;
};

module.exports = Local;