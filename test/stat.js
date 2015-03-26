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

describe('#state', function(){
    it('Should have folder properties name, path and type.', function(){
        var stat = mime.stat(path.join(__dirname, 'home'));

        stat.should.have.property('name', 'home');
        stat.should.have.property('path', path.join(__dirname, 'home'));
        stat.should.have.property('type', 'folder');
        stat.should.have.property('display');
    });

    it('Should have file properties name, path and type.', function(){
        var stat = mime.stat(path.join(__dirname, 'home', 'mongodb.pdf'));

        stat.should.have.property('name', 'mongodb.pdf');
        stat.should.have.property('path', path.join(__dirname, 'home', 'mongodb.pdf'));
        stat.should.have.property('type', 'pdf');
        stat.should.have.property('display');
    });

    it('Should have default mime types.', function(){
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

    it('Should append more mime types.', function(){
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
/*
    it('Should throw exception.', function(done){
        function throwNextTick(error) {
            process.nextTick(function () {
                throw error;
            });
        }

        var recordedError = null;
        var originalException = process.listeners('uncaughtException').pop();

        process.removeListener('uncaughtException', originalException);
        process.once("uncaughtException", function (error) {
            recordedError = error;
        });

        var error = mime.stat('path/xpto');

        throwNextTick(error);

        process.nextTick(function () {
            process.listeners('uncaughtException').push(originalException);

            recordedError.should.equal(error);

            done();
        });
    });*/
});