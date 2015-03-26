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
var Local  = require('../lib/local'),
    path   = require('path'),
    should = require('should');

describe('#local', function(){
    it('Should throw exception constructor path property.', function(){
        (function() { new Local() }).should.throw(Error);
    });

    it('Should callback error be present.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.open('/path/xpto', function(err, rs){
            err.code.should.eql('ENOENT');

            done();
        });
    });

    it('Should list folder with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.open("/", function(err, rs){
            done();
        });
    });

    it('Should list folder with event emitter.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(err, rs){
            done();
        });

        folder.open("/");
    });

    it('Should find file by extension.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(err, rs){
            var pdf = folder.find('pdf');

            pdf.should.have.property('type').eql('pdf');

            done();
        });

        folder.open("/");
    });

    it('Should find folder.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(err, rs){
            var fold = folder.find('mydocs');

            fold.should.have.property('type').eql('folder');

            done();
        });

        folder.open("/");
    });

    it('Should find file that name contains string.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(err, rs){
            var fl = folder.find('db');

            fl.should.have.property('name').containEql('db');

            done();
        });

        folder.open("/");
    });
});