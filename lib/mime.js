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
 * mime.js
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

module.exports = (function() {
    var module = {
        _mimes: {
            'compressed' : ['zip', 'rar', 'gz', 'tar'],
            'text'       : ['txt', 'md', 'nfo'],
            'image'      : ['jpg', 'jpge', 'png', 'gif', 'bmp', 'svg'],
            'pdf'        : ['pdf'],
            'css'        : ['css'],
            'html'       : ['html'],
            'word'       : ['doc', 'docx'],
            'powerpoint' : ['ppt', 'pptx'],
            'movie'      : ['mkv', 'avi', 'rmvb', 'mpeg', 'wmv']
        },
        _cached: {},
        _stat: function(filepath) {

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

                    result.type = module._cached[ext];

                    if (!result.type) {
                        for (var key in module._mimes) {
                            if (_.include(module._mimes[key], ext)) {
                                module._cached[ext] = result.type = key;

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
        },
        _getMimes: function() {
            return _mimes;
        },
        _setMimes: function(mimes) {
            //@TODO: merge default with new ones
            console.log("TODO");
        }
    };

    return {
        stat: module._stat,
        getMimes: module._getMimes
    }
})();