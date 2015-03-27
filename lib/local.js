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