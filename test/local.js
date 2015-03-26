"use strict";

/**
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
var Local = require('../lib/local'),
    path   = require('path'),
    should = require('should');

describe('#local', function(){
    it('Should list folder with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.open(path.join(__dirname, 'home'), function(rs){
            done();
        });
    });

    it('Should list folder with event emitter.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(rs){
            done();
        });

        folder.open(path.join(__dirname, 'home'));
    });

    it('Should find file by extension.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(rs){
            var pdf = folder.find('pdf');

            pdf.should.have.property('type').eql('pdf');

            done();
        });

        folder.open(path.join(__dirname, 'home'));
    });

    it('Should find folder.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(rs){
            var fold = folder.find('mydocs');

            fold.should.have.property('type').eql('folder');

            done();
        });

        folder.open(path.join(__dirname, 'home'));
    });

    it('Should find file that name contains string.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(rs){
            var fl = folder.find('db');

            fl.should.have.property('name').containEql('db');

            done();
        });

        folder.open(path.join(__dirname, 'home'));
    });
});