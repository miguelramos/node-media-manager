"use strict";

/**
 *
 * ----------------------------------------------------------------------------
 * browser.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var should  = require('should'),
    path    = require('path'),
    Browser = require('../');

describe('#browser', function(){
    it('Should require browser mime and get default types.', function(){
        var stat = Browser.mimes.getMimes();

        var types = {
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

        stat.should.be.eql(types);
    });

    it('Should browser function init folder with settings.', function(){
        var settings = {
            home: path.join(__dirname, 'home'),
            mimes: {
                'excel': ['xsl'],
                'xml': ['xml']
            }
        };

        var browser = Browser(settings);

        browser.should.have.property('home').eql(path.join(__dirname, 'home'));

        Browser.mimes.reset();
    });
});