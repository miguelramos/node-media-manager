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

describe('#Local', function(){
    var browser = new Local(path.join(__dirname, 'home'));

    it('> Error: Should throw exception constructor path property.', function(){
        (function() {
            new Local()
        }).should.throw(Error);
    });

    it('> Error: Should throw security error on callback.', function(done){
        browser.open('../../../', function(error, files){
            if(error) {
                error.should.be.instanceOf(Error);
            }

            done();
        });
    });

    it('> Error: Should throw security error on emit.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.open('../../../');
    });

    it('> Error: Should open and throw error on callback.', function(done){
        browser.open('/path/unknown', function(error, files){
            if(error) {
                error.should.be.instanceOf(Error);
            }

            done();
        });
    });

    it('> Error: Should open and throw error on emit.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.open('/path/unknown');
    });

    it('> State: Should open and list files thru callback.', function(done){

        browser.open('/', function(error, list){
            if(error) {
                return done(error);
            }

            list.should.be.Object;

            done();
        });
    });

    it('> State: Should open and list files thru emitter.', function(done){

        browser.on('finish', function(list){
            list.should.be.Object;

            done();
        });

        browser.open('/');
    });

    it('> State: Should add file to home with callback response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

        browser.add(image, 'mydocs', function(error, file){
            if(error) {
                done(error);
            }

            file.should.have.property('name');
            file.should.have.property('path');
            file.should.have.property('ext');
            file.should.have.property('rel');

            done();
        });
    });

    it('> State: Should add file to home with emitter response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'code-wallpaper-java.png');

        browser.on('finish', function(file){
            file.should.have.property('name');
            file.should.have.property('path');
            file.should.have.property('ext');
            file.should.have.property('rel');

            done();
        });

        browser.add(image, 'mydocs');
    });

    it('> Error: Should throw security error add file thru callback response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

        browser.add(image, '../../../', function(error, file){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw security error add file thru emitter response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.add(image, '../../../');
    });

    it('> Error: Should throw error on read file not exist thru callback response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'empty.jpg');

        browser.add(image, 'mydocs', function(error, file){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw error on read file not exist thru emmiter response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'empty.jpg');

        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.add(image, 'mydocs');
    });

    it('> Error: Should throw error on write file thru callback response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

        browser.add(image, 'mydocs/empty.jpg', function(error, file){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw error on write file thru emitter response.', function(done){
        var image  = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.add(image, 'mydocs/empty.jpg');
    });

    it('> State: Should create directory with callback response.', function(done){
        browser.create('tmp', '0777', function(error, dir){
            if(error) {
                done(error);
            }

            dir.should.be.equal(path.join(__dirname, 'home', 'tmp'));

            done();
        });
    });

    it('> State: Should create directory with emitter response.', function(done){
        browser.on('finish', function(dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'temp'));

            done();
        });

        browser.create('temp', '0777');
    });

    it('> State: Should create directory without mode with emitter response.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.on('finish', function(dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'great'));

            done();
        });

        browser.create('great');
    });

    it('> Error: Should throw security error on create directory with callback response.', function(done){
        browser.create('../../../tmp', '0777', function(error, dir){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw error on create directory with callback response.', function(done){
        browser.create('tmp', '0777', function(error, dir){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw error on create directory with emitter response.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.create('temp', '0777');
    });

    it('> State: Should remove directory with callback response.', function(done){
        browser.remove('tmp', function(error, dir){
            if(error) {
                done(error);
            }

            dir.should.be.equal(path.join(__dirname, 'home', 'tmp'));

            done();
        });
    });

    it('> State: Should remove directory with emitter response.', function(done){
        browser.on('finish', function(dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'temp'));

            done();
        });

        browser.remove('temp');
    });

    it('> State: Should remove file with callback response.', function(done){
        browser.remove('mydocs/code-wallpaper-java.png', function(error, file){
            if(error) {
                done(error);
            }

            file.should.be.equal(path.join(__dirname, 'home', 'mydocs/code-wallpaper-java.png'));

            done();
        });
    });

    it('> State: Should remove file with emitter response.', function(done){
        browser.on('finish', function(file){
            file.should.be.equal(path.join(__dirname, 'home', 'mydocs/code-wallpaper-power.jpg'));

            done();
        });

        browser.remove('mydocs/code-wallpaper-power.jpg');
    });

    it('> Error: Should throw security error on remove directory with callback response.', function(done){
        browser.remove('../../..tmp', function(error, dir){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw error on remove directory with callback response.', function(done){
        browser.remove('empty', function(error, file){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw error on remove file with emitter response.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.remove('empty.jpg');
    });

    it('> State: Should copy file with callback response.', function(done){
        browser.copy('wallpaper.jpg', 'mydocs/wp.jpg', function(error, file){
            if(error) {
                done(error);
            }

            file.should.have.property('from', path.join(__dirname, 'home', 'wallpaper.jpg'));
            file.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'wp.jpg'));

            done();
        });
    });

    it('> State: Should copy file with emitter response.', function(done){
        browser.on('finish', function(file){
            file.should.have.property('from', path.join(__dirname, 'home', 'mongodb.pdf'));
            file.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'manual.pdf'));

            done();
        });

        browser.copy('mongodb.pdf', 'mydocs/manual.pdf');
    });

    it('> Error: Should throw security error on copy file with emitter response.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.copy('../../../mongodb.pdf', 'mydocs/manual.pdf');
    });

    it('> Error: Should throw error on copy file with callback response.', function(done){
        browser.copy('nofile.pdf', 'mydocs/manual.pdf', function(error, file){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> State: Should move directory with callback response.', function(done){
        browser.move('mypics', 'mydocs/pics', function(error, dir){
            dir.should.have.property('from', path.join(__dirname, 'home', 'mypics'));
            dir.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'pics'));

            done();
        });
    });

    it('> State: Should move file with emitter response.', function(done){
        browser.on('finish', function(file){
            file.should.have.property('from', path.join(__dirname, 'home', 'mongodb.pdf'));
            file.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'mongo.pdf'));

            done();
        });

        browser.move('mongodb.pdf', 'mydocs/mongo.pdf');
    });

    it('> Error: Should throw security error on move directory with callback response.', function(done){
        browser.move('../../..tmp', 'mydocs/tmp', function(error, dir){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> Error: Should throw error on move file with emitter response.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.move('nofile.pdf', 'mydocs/nofile.pdf');
    });

    it('> State: Should link directory with callback response.', function(done){
        browser.link('.secret', 'mydocs/secret', function(error, link){
            link.should.have.property('from', path.join(__dirname, 'home', '.secret'));
            link.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'secret'));

            done();
        });
    });

    it('> State: Should link file with emitter response.', function(done){
        browser.on('finish', function(link){
            link.should.have.property('from', path.join(__dirname, 'home', '.secret/mongodb.pdf'));
            link.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'my.pdf'));

            done();
        });

        browser.link('.secret/mongodb.pdf', 'mydocs/my.pdf');
    });

    it('> Error: Should throw security error on link file with emitter response.', function(done){
        browser.on('error', function(error){
            error.should.be.instanceOf(Error);

            done();
        });

        browser.link('../../../nofile.pdf', 'mydocs/nofile.pdf');
    });

    it('> Error: Should throw error on link directory with callback response.', function(done){
        browser.link('.secret', 'mydocs', function(error, link){
            error.should.be.instanceOf(Error);

            done();
        });
    });

    it('> State: Should find directories with callback response.', function(done){
        browser.open('/', function(error, files){
            if(error) {
                error.should.be.instanceOf(Error);
            }

            browser.search('my').length.should.be.above(0);

            done();
        });
    });

});