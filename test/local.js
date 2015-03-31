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

    it('> Error: Should open and error be passed as callback.', function(done){
        browser.open('/path/unknown', function(error, files){
            if(error) {
                error.should.be.instanceOf(Error);
            }

            done();
        });
    });

    it('> Error: Should open and error be emitted.', function(done){
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
});




/*describe('#local', function(){
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
            console.log(err);
            //err.message.should.equal("Permission denied to access folder outside home.");

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
            if(err){
                err.code.should.eql('EEXIST');
            }

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

    it('Should test copy file with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.copy('mongodb.pdf', '.secret/mongo.pdf', function(error, paths){
            paths.should.have.property('from', path.join(__dirname, 'home', 'mongodb.pdf'));
            paths.should.have.property('to', path.join(__dirname, 'home', '.secret', 'mongo.pdf'));

            done();
        });
    });

    it('Should test copy file with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onCopy', function(err, paths){
            paths.should.have.property('from', path.join(__dirname, 'home', 'mongodb.pdf'));
            paths.should.have.property('to', path.join(__dirname, 'home', '.secret', 'mymongo.pdf'));

            done();
        });

        folder.copy('mongodb.pdf', '.secret/mymongo.pdf');
    });

    it('Should test copy file error with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.copy('nofile.pdf', '.secret/nofile.pdf', function(error, paths){
            error.code.should.be.equal('ENOENT');

            done();
        });
    });

    it('Should test copy file error with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onCopy', function(err, paths){
            err.code.should.be.equal('ENOENT');

            done();
        });

        folder.copy('file.pdf', '.secret/file.pdf');
    });

    it('Should test remove directory with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.mkdir('temp', '0777', function(err, directory){
            folder.remove('temp', function(err, dir){
                dir.should.be.equal(directory);

                done();
            });
        });
    });

    it('Should test remove directory with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRmdir', function(err, dir){
            dir.should.be.equal(path.join(__dirname, 'home', 'tmp'));

            done();
        });

        folder.mkdir('tmp', '0777', function(err, directory){
            folder.remove('tmp');
        });
    });

    it('Should test remove file with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.remove('mydocs/code-wallpaper-java.png', function(err, file){
            file.should.be.equal(path.join(__dirname, 'home', 'mydocs/code-wallpaper-java.png'));

            done();
        });
    });

    it('Should test remove file with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRemove', function(err, file){
            file.should.be.equal(path.join(__dirname, 'home', 'mydocs/code-wallpaper-power.jpg'));

            done();
        });

        folder.remove('mydocs/code-wallpaper-power.jpg');
    });

    it('Should test remove directory error with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.remove('temp', function(err, dir){
            err.code.should.be.equal('ENOENT');

            done();
        });
    });

    it('Should test remove file error with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        folder.on('onRemove', function(err, file){
            err.code.should.be.equal('ENOENT');

            done();
        });

        folder.remove('mydocs/code-wallpaper-power.jpg');
    });

    it('Should test move directory with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = '.secret';

        folder.move(from, "mydocs/tmp", function(error, rs){
            rs.should.have.property('from', path.join(__dirname, 'home', '.secret'));
            rs.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'tmp'));

            folder.move('mydocs/tmp', '.secret', function(err, rs){
                done();
            });
        });
    });

    it('Should test move directory with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = '.secret';

        folder.on('onMove', function(err, rs){
            rs.should.have.property('from', path.join(__dirname, 'home', '.secret'));
            rs.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'temp'));

            folder.move('mydocs/temp', '.secret', function(error, rs){
                done();
            });

        });

        folder.move(from, "mydocs/temp");
    });

    it('Should test move file with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'mongodb.pdf';

        folder.move(from, "mydocs/mongo-manual.pdf", function(error, rs){
            rs.should.have.property('from', path.join(__dirname, 'home', 'mongodb.pdf'));
            rs.should.have.property('to', path.join(__dirname, 'home', 'mydocs', 'mongo-manual.pdf'));

            done();
        });
    });

    it('Should test move file with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'mydocs/mongo-manual.pdf';

        folder.on('onMove', function(err, rs){
            rs.should.have.property('to', path.join(__dirname, 'home', 'mongodb.pdf'));
            rs.should.have.property('from', path.join(__dirname, 'home', 'mydocs', 'mongo-manual.pdf'));

            done();
        });

        folder.move(from, "mongodb.pdf");
    });

    it('Should test move directory error with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'xpto';

        folder.move(from, "mydocs", function(error, rs){
            error.code.should.be.equal('ENOENT');

            done();
        });
    });

    it('Should test move directory error with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'xpto';

        folder.on('onMove', function(err, rs){
            err.code.should.be.equal('ENOENT');

            done();
        });

        folder.move(from, "mydocs");
    });

    it('Should test move file error with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'mongo-manual.pdf';

        folder.move(from, "mydocs/mongo-manual.pdf", function(error, rs){
            error.code.should.be.equal('ENOENT');

            done();
        });
    });

    it('Should test move file error with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'mongo-manual.pdf';

        folder.on('onMove', function(err, rs){
            err.code.should.be.equal('ENOENT');

            done();
        });

        folder.move(from, "mongodb.pdf");
    });

    it('Should test symbolic folder with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = '.secret';

        folder.link(from, "mydocs/secret", function(error, rs){
            rs.should.have.property('source', path.join(__dirname, 'home', '.secret'));
            rs.should.have.property('destination', path.join(__dirname, 'home', 'mydocs', 'secret'));

            folder.remove('mydocs/secret', function(err, rs){
                done();
            });
        });
    });

    it('Should test symbolic folder with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = '.secret';

        folder.on('onSymbolic', function(err, rs){
            rs.should.have.property('source', path.join(__dirname, 'home', '.secret'));
            rs.should.have.property('destination', path.join(__dirname, 'home', 'mydocs', 'secret'));

            folder.remove('mydocs/secret', function(err, rs){
                done();
            });
        });

        folder.link(from, "mydocs/secret");
    });

    it('Should test symbolic file with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'mongodb.pdf';

        folder.link(from, "mydocs/manual.pdf", function(error, rs){
            rs.should.have.property('source', path.join(__dirname, 'home', from));
            rs.should.have.property('destination', path.join(__dirname, 'home', 'mydocs', 'manual.pdf'));

            folder.remove('mydocs/manual.pdf', function(err, rs){
                done();
            });
        });
    });

    it('Should test symbolic file with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = 'mongodb.pdf';

        folder.on('onSymbolic', function(err, rs){
            rs.should.have.property('source', path.join(__dirname, 'home', from));
            rs.should.have.property('destination', path.join(__dirname, 'home', 'mydocs', 'manual.pdf'));

            folder.remove('mydocs/manual.pdf', function(err, rs){
                done();
            });
        });

        folder.link(from, "mydocs/manual.pdf");
    });

    it('Should test symbolic folder error with callback.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = '.secret';

        folder.link(from, "mydocs", function(error, rs){
            error.code.should.be.equal('EEXIST');

            done();
        });
    });

    it('Should test symbolic folder error with event.', function(done){
        var folder = new Local(path.join(__dirname, 'home')),
            from   = '.secret';

        folder.on('onSymbolic', function(err, rs){
            err.code.should.be.equal('EEXIST');

            done();
        });

        folder.link(from, "mydocs");
    });
});*/