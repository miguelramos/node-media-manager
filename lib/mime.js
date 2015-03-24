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
var fs    = require('fs'),
    path  = require('path'),
    utils = require('./utils'),
    _     = require('underscore');

module.exports = (function() {
    /**
     * Object to add properties description to file or folder. Methods
     * to add and list mime types.
     *
     * @type {Object}
     */
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
                name    : path.basename(filepath),
                path    : filepath,
                display : 'visible'
            };

            //Windows not supported
            var isHidden = function(path) {
                return (/(^|.\/)\.+[^\/\.]/g).test(path);
            };

            try {
                var stat = fs.statSync(filepath);

                if(isHidden(filepath)) {
                    result.display = 'hidden';
                }

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
                    }

                    if (!result.type) {
                        result.type = 'blank';
                    }
                }
            } catch (e) {
                console.log(e);
            }

            return result;
        },
        _getMimes: function() {
            return module._mimes;
        },
        _setMimes: function(mimes) {
            module._mimes = utils.merge(module._mimes, mimes);
        },
        _reset: function() {
            module._mimes = {
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
        }
    };

    return {
        stat: module._stat,
        reset: module._reset,
        setMimes: module._setMimes,
        getMimes: module._getMimes
    }
})();