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

        folder.add(image, 'mydocs', null, function(error, file){
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

        folder.add(image, '../../../', null, function(error, file){
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

        folder.add(image, 'mydocs', null, function(error, file){
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

        folder.add(image, 'myfolder', null, function(error, file){
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

    it('Should test mkdir with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.mkdir('tmp', '0777', function(err, dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'tmp'));

            done();
        });
    });

    it('Should test mkdir with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onMkdir', function(err, dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'temp'));

            done();
        });

        folder.mkdir('temp', '0777');
    });

    it('Should test mkdir without mode with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onMkdir', function(err, dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'mode'));

            folder.rmdir('mode', function(err, dir){
                done();
            });
        });

        folder.mkdir('mode');
    });

    it('Should test rmdir with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.rmdir('tmp', function(err, dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'tmp'));

            done();
        });
    });

    it('Should test rmdir with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRmdir', function(err, dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'temp'));

            done();
        });

        folder.rmdir('temp');
    });

    it('Should test mkdir error with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.mkdir('tmp', '0777', function(err, dir){
            folder.mkdir('tmp', '0777', function(error, dir){
                error.code.should.eql('EEXIST');

                done();
            });
        });
    });

    it('Should test mkdir error with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onMkdir', function(err, dir){
            err.code.should.eql('EEXIST');

            done();
        });

        folder.mkdir('temp', '0777', function(err, dir){
            folder.mkdir('temp', '0777');
        });
    });

    it('Should test rmdir error with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.rmdir('tmp', function(error, dir){
            folder.rmdir('tmp', function(err, dir){
                err.code.should.eql('ENOENT');

                done();
            });
        });
    });

    it('Should test rmdir error with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRmdir', function(err, dir){
            err.code.should.eql('ENOENT');

            done();
        });

        folder.rmdir('temp', function(err, dir){
            folder.rmdir('temp');
        });
    });
});