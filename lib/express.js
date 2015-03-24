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
 * express.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var Browser = require('../'),
    path    = require('path');

module.exports = function(options) {

    var browser = Browser(options || {});

    var middleware = function(req, res, next) {

        Object.defineProperty(browser, 'current', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: req.query.hasOwnProperty('root') ? path.join(browser.home, req.query.root) : path.join(browser.home, '/')
        });

        req.browser = browser;

        next();
    };

    return middleware;
};