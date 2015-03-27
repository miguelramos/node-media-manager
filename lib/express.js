"use strict";

/**
 *
 * ----------------------------------------------------------------------------
 * express.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var browser = require('../'),
    path    = require('path');

module.exports = function(options) {

    var manager = browser(options || {});

    var middleware = function(req, res, next) {
        //Define new property where it's values is current list relative path

        Object.defineProperty(manager, 'root', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: req.query.hasOwnProperty('root') ? req.query.root : "/"
        });

        req.browser = manager;

        next();
    };

    return middleware;
};