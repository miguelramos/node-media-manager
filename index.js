"use strict";

/**
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
var mime   = require('./lib/mime'),
    utils  = require('./lib/utils'),
    Local = require('./lib/local');

module.exports = Browser;

function Browser(){
    var args     = [].splice.call(arguments, 0),
        options  = args.splice(0, 1)[0],
        settings = {home: __dirname};

    var toString = Object.prototype.toString;

    if(toString.call(options) === '[object Object]') {
        settings = {
            home  : options.hasOwnProperty('home') ? options.home : __dirname,
            mimes : options.hasOwnProperty('mimes') ? options.mimes : {}
        };

        settings = utils.merge(settings, options);

        mime.setMimes(settings.mimes);
    }

    var local = new Local(settings.home);

    return local;
}

Browser.express = require('./lib/express');
Browser.mimes   = mime;