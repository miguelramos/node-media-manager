"use strict";

/**
 * ██╗    ██╗███████╗██████╗ ███████╗██╗   ██╗██████╗ ██╗     ██╗███╗   ███╗███████╗    ██████╗ ██████╗ ███╗   ███╗
 * ██║    ██║██╔════╝██╔══██╗██╔════╝██║   ██║██╔══██╗██║     ██║████╗ ████║██╔════╝   ██╔════╝██╔═══██╗████╗ ████║
 * ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║██████╔╝██║     ██║██╔████╔██║█████╗     ██║     ██║   ██║██╔████╔██║
 * ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║██╔══██╗██║     ██║██║╚██╔╝██║██╔══╝     ██║     ██║   ██║██║╚██╔╝██║
 * ╚███╔███╔╝███████╗██████╔╝███████║╚██████╔╝██████╔╝███████╗██║██║ ╚═╝ ██║███████╗██╗╚██████╗╚██████╔╝██║ ╚═╝ ██║
 * ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝╚═╝     ╚═╝╚══════╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
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
    _      = require('underscore');

function Folder() {
    events.EventEmitter.call(this);

    this.files = {};
}

util.inherits(Folder, events.EventEmitter);

Folder.prototype.open = function(dir, cb) {
    var self = this;

    fs.readdir(dir, function(error, files) {
        if (error) {
            return console.log(error);
        }

        for (var i = 0; i < files.length; ++i) {
            files[i] = mime.stat(path.join(dir, files[i]));
        }

        template(files);

        self.files = {
            files: files,
            template: template(files).join('\n')
        };

        self.emit('onRead', self.files);

        if(typeof cb === 'function') {
            cb(self.files);
        }
    });
};

function template(tree) {
    var html = [];

    _.each(tree, function(item){
        var link = util.format('<a data-type="%s" data-path="%s" class="">%s</a>', item.type, item.path, item.name);

        html.push(link);
    });

    return html;
}

module.exports = Folder;