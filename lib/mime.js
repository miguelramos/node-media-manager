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
 * index.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore');

var mimes = {
    'compressed' : ['zip', 'rar', 'gz', 'tar'],
    'text'       : ['txt', 'md', 'nfo'],
    'image'      : ['jpg', 'jpge', 'png', 'gif', 'bmp', 'svg'],
    'pdf'        : ['pdf'],
    'css'        : ['css'],
    'html'       : ['html'],
    'word'       : ['doc', 'docx'],
    'powerpoint' : ['ppt', 'pptx'],
    'movie'      : ['mkv', 'avi', 'rmvb', 'mpeg', 'wmv']
};

var cached = {};

module.exports.stat = function(filepath) {
    var result = {
        name: path.basename(filepath),
        path: filepath
    };

    try {
        var stat = fs.statSync(filepath);

        if (stat.isDirectory()) {
            result.type = 'folder';
        } else {
            var ext = path.extname(filepath).substr(1);

            result.type = cached[ext];

            if (!result.type) {
                for (var key in mimes) {
                    if (_.include(mimes[key], ext)) {
                        cached[ext] = result.type = key;
                        break;
                    }
                }

                if (!result.type) {
                    result.type = 'blank';
                }
            }
        }
    } catch (e) {
        console.log(e);
    }

    return result;
};