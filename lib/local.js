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

            this.removeAllListeners('error');
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

        return files = {
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

Local.prototype.add = function() {

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


Local.prototype.open = function(dir, cb) {
    var self      = this,
        directory = path.resolve(this.home, path.join(this.home, dir));

    try {
        this.isOutside(dir);
    } catch(e) {
        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(e, null);
            });
        } else {
            this.emit('onRead', e, null);
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


Local.prototype.add = function(filepath, to, name, cb) {
    var self     = this,
        basename = name ? path.basename(name, path.extname(name)) : path.basename(filepath, path.extname(filepath)),
        filename = S(basename).slugify().s;

    try {
        this.isOutside(dir);
    } catch(e) {
        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(e, null);
            });
        } else {
            this.emit('onRead', e, null);
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
            if(err) {
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

    fs.lstat(absolute, function(error, stat){
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
            } else if(stat.isSymbolicLink()) {
                _deleteFile();
            } else {
                _deleteFile();
            }
        });
    });
};


Local.prototype.copy = function(src, dst, cb) {
    var from = path.resolve(this.home, path.join(this.home, src)),
        to   = path.resolve(this.home, path.join(this.home, dst)),
        self = this;


    stream(from, to, function(error, rs){
        if(error) {
            if(typeof cb === 'function') {
                cb(error, null);
            } else {
                self.emit('onCopy', error, null);
            }

            return;
        }

        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(null, rs);
            });
        } else {
            self.emit('onCopy', null, rs);
        }
    });
};


Local.prototype.move = function(from, to, cb) {
    var oldPath = path.resolve(this.home, path.join(this.home, from)),
        newPath = path.resolve(this.home, path.join(this.home, to)),
        self    = this;

    fs.rename(oldPath, newPath, function(error){
        if(error) {
            if(typeof cb === 'function') {
                cb(error, null);
            } else {
                self.emit('onMove', error, null);
            }

            return;
        }

        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(null, {from: oldPath, to: newPath});
            });
        } else {
            self.emit('onMove', null, {from: oldPath, to: newPath});
        }
    });
};


Local.prototype.link = function(srcpath, dstpath, cb) {
    var src  = path.resolve(this.home, path.join(this.home, srcpath)),
        dst  = path.resolve(this.home, path.join(this.home, dstpath)),
        self = this;

    fs.symlink(src, dst, function(err){
        if(err) {
            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(err, null);
                });
            } else {
                self.emit('onSymbolic', err, null);
            }

            return;
        }

        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(null, {source: src, destination: dst});
            });
        } else {
            self.emit('onSymbolic', null, {source: src, destination: dst});
        }
    });
};


Local.prototype.mkdir = function(dir, mode, cb) {
    var directory = path.resolve(this.home, path.join(this.home, dir)),
        self      = this;

    if(!mode) {
        mode = '0777';
    }

    fs.mkdir(directory, mode, function(err){
        if(err) {
            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(err, null);
                });
            } else {
                self.emit('onMkdir', err, null);
            }

            return;
        }

        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(null, directory);
            });
        } else {
            self.emit('onMkdir', null, directory);
        }
    });
};


Local.prototype.rmdir = function(dir, cb) {
    var directory = path.resolve(this.home, path.join(this.home, dir)),
        self      = this;

    fs.rmdir(directory, function(err){
        if(err) {
            if(typeof cb === 'function') {
                process.nextTick(function() {
                    cb(err, null);
                });
            } else {
                self.emit('onRmdir', err, null);
            }

            return;
        }

        if(typeof cb === 'function') {
            process.nextTick(function() {
                cb(null, directory);
            });
        } else {
            self.emit('onRmdir', null, directory);
        }
    });
};


Local.prototype.isOutside = function(dir) {
    var basename = path.basename(this.home);

    var resolve = path.resolve(this.home, path.join(this.home, dir)).substring(this.home.length-basename.length);//path.resolve(this.home, path.join(this.home, dir));

    if(S(resolve).contains(basename) === false) {
        throw new Error("Permission denied to access folder outside home.");
    }
};


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
};*/

module.exports = Local;