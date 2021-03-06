"use strict";

/**
 *
 * ----------------------------------------------------------------------------
 * stat.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var mime   = require('../lib/mime'),
    path   = require('path'),
    should = require('should');

describe('#Mime State', function(){
    it('> State: Should have folder properties name, path and type.', function(){
        var stat = mime.stat(path.join(__dirname, 'home'));

        stat.should.have.property('name', 'home');
        stat.should.have.property('path', path.join(__dirname, 'home'));
        stat.should.have.property('type', 'folder');
        stat.should.have.property('display');
    });

    it('> State: Should have file properties name, path and type.', function(){
        var stat = mime.stat(path.join(__dirname, 'home', 'mongodb.pdf'));

        stat.should.have.property('name', 'mongodb.pdf');
        stat.should.have.property('path', path.join(__dirname, 'home', 'mongodb.pdf'));
        stat.should.have.property('type', 'pdf');
        stat.should.have.property('display');
    });

    it('> State: Should have default mime types.', function(){
        var stat = mime.getMimes();

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

    it('> State: Should append more mime types.', function(){
        mime.setMimes({
            'excel': ['xsl'],
            'xml': ['xml']
        });

        var stat = mime.getMimes();

        var types = {
            'compressed' : ['zip', 'rar', 'gz', 'tar'],
            'text'       : ['txt', 'md', 'nfo'],
            'image'      : ['jpg', 'jpge', 'png', 'gif', 'bmp', 'svg'],
            'pdf'        : ['pdf'],
            'css'        : ['css'],
            'html'       : ['html'],
            'word'       : ['doc', 'docx'],
            'powerpoint' : ['ppt', 'pptx'],
            'movie'      : ['mkv', 'avi', 'rmvb', 'mpeg', 'wmv'],
            'excel'      : ['xsl'],
            'xml'        : ['xml']
        };

        stat.should.be.eql(types);
    });

    it('> Error: Should throw exception path not found.', function(){
        mime.stat.bind(mime.stat, 'path/xpto').should.throw(Error);
    });
});