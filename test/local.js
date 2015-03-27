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
    should = require('should'),
    utils  = require('util');

describe('#local', function(){
    it('Should throw exception constructor path property.', function(){
        (function() { new Local() }).should.throw(Error);
    });

    it('Should callback error be present.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.open('/path/xpto', function(err, rs){
            process.nextTick(function () {
                err.code.should.eql('ENOENT');

                done();
            });
        });
    });

    it('Should event error be present.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(err, rs){
            err.code.should.eql('ENOENT');

            done();
        });

        folder.open('/path/xpto');
    });

    it('Should test possible security breach on event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRead', function(err, rs){
            err.message.should.equal("Permission denied to access folder outside home.");

            done();
        });

        folder.open('../../../');
    });

    it('Should test possible security breach on callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.open('../../../', function(err, rs){
            process.nextTick(function () {
                err.message.should.equal("Permission denied to access folder outside home.");

                done();
            });
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

    it('Should add file to home with callback response.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

        folder.add(image, 'mydocs', function(error, file){
            file.should.have.property('name');
            file.should.have.property('path');
            file.should.have.property('ext');
            file.should.have.property('rel');

            done();
        });
    });

    it('Should add file to home with event response.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'code-wallpaper-java.png');

        folder.on('onAddFile', function(err, file){
            file.should.have.property('name');
            file.should.have.property('path');
            file.should.have.property('ext');
            file.should.have.property('rel');

            done();
        });

        folder.add(image, 'mydocs');
    });

    it('Should test add file possible security breach on callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'code-wallpaper-java.png');

        folder.add(image, '../../../', function(error, file){
            process.nextTick(function () {
                error.message.should.equal("Permission denied to access folder outside home.");

                done();
            });
        });
    });

    it('Should test add file possible security breach on event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'code-wallpaper-java.png');

        folder.on('onReadFile', function(err, file){
            err.message.should.equal("Permission denied to access folder outside home.");

            done();
        });

        folder.add(image, '../../../');
    });

    it('Should test file do not exist with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'xpto.png');

        folder.add(image, 'mydocs', function(error, file){
            process.nextTick(function () {
                error.code.should.eql('ENOENT');

                done();
            });
        });
    });

    it('Should test file do not exist with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'xpto.png');

        folder.on('onReadFile', function(err, file){
            err.code.should.eql('ENOENT');

            done();
        });

        folder.add(image, 'mydocs');
    });

    it('Should test folder do not exist with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'code-wallpaper-java.png');

        folder.add(image, 'myfolder', function(error, file){
            process.nextTick(function () {
                error.code.should.eql('ENOENT');

                done();
            });
        });
    });

    it('Should test folder do not exist with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            image  = path.join(__dirname, 'fixtures', 'code-wallpaper-java.png');

        folder.on('onAddFile', function(err, file){
            err.code.should.eql('ENOENT');

            done();
        });

        folder.add(image, 'myfolder');
    });
});