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
    var self = this;

    fs.readdir(dir, function(error, files) {
        if (error) {
            if(typeof cb === 'function') {
                cb(error, null);
            }

            return;
        }

        for (var i = 0; i < files.length; ++i) {
            files[i] = mime.stat(path.join(dir, files[i]));

            if(self.home && files[i].hasOwnProperty('path')) {
                files[i].relative = files[i].path.substring(self.home.length);
            }
        }

        self.files = {
            files: files,
            template: utils.template(files).join('\n')
        };

        self.emit('onRead', self.files);

        if(typeof cb === 'function') {
            cb(null, self.files);
        }
    });
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