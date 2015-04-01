var should  = require('should'),
    path    = require('path'),
    fs      = require('fs'),
    express = require('express'),
    request = require('supertest'),
    Browser = require('../../'),
    parted  = require('parted'),
    bodyParser = require('body-parser');

describe('#Express', function(){

    var status = 200;

    after(function(done){
        var browser = new Local(path.join(__dirname, 'home'));

        browser.move(path.join(__dirname, '..', 'home', 'mypics/wallpaper-power.jpg'), path.join(__dirname, '..', 'home', 'mypics/code-wallpaper-power.jpg'));
    });

    it('> State: Should have function for middleware.', function(){
        var middleware = Browser.express({
            home: path.join(__dirname, '..', 'home')
        });

        middleware.should.Function;
    });

    it('> State: Should middleware add new property to Browser instance.', function(done){

        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }), function(req, resp, next) {
            req.should.have.property('browser');
            req.browser.should.have.property('root').String;

            next();
        });

        app.get('/browser', function(req, res){
            res.status(200).send({ success: true });
        });

        request(app).get('/browser').expect(200, done);
    });

    it('> State: Should request have property browser with value folder instance.', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser', function(req, res){
            req.should.have.property('browser');

            res.status(200).send({ success: true });
        });

        request(app).get('/browser').expect(200, done);
    });


    it('GET /browser?root=/', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser', function(req, res){
            var browser = req.browser;

            browser.open(browser.root, function(error, contents){
                if(error) {
                    status = 400;
                } else {
                    status = 200;
                }

                contents.should.have.property('list');

                (contents['list'].length).should.be.above(0);

                res.status(status).send(contents);
            });
        });

        request(app).get('/browser?root=%2F').expect(200, done);
    });

    it('Possible security breach: GET /browser?root=../../../', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser', function(req, res){
            var browser = req.browser;

            browser.open(browser.root, function(error, list){
                if(error) {
                    status = 400;
                } else {
                    status = 200;
                }

                error.should.be.instanceOf(Error);

                res.status(status).send({});
            });
        });

        request(app).get('/browser?root=..%2F..%2F..%2F').expect(400, done);
    });

    it('GET /browser?root=/mydocs', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser', function(req, res){
            var browser = req.browser;

            browser.open(browser.root, function(error, contents){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                contents.should.have.property('list');

                (contents['list'].length).should.be.above(0);

                res.status(status).send(contents);
            });
        });

        request(app).get('/browser?root=%2Fmydocs').expect(200, done);
    });

    it('GET /browser?root=/.secret', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser', function(req, res){
            var browser = req.browser;

            browser.open(browser.root, function(error, contents){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                contents.should.have.property('list');

                (contents['list'].length).should.be.above(0);

                res.status(status).send(contents);
            });
        });

        request(app).get('/browser?root=%2F.secret').expect(200, done);
    });

    it('POST /browser/find?root=/', function(done){
        var app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.post('/browser/find', function(req, res){
            var browser = req.browser;

            browser.open(browser.root, function(err, list){
                var search = req.body.hasOwnProperty('search') ? req.body.search : null;

                var pdf    = browser.search(search),
                    status = pdf ? 200 : 400;

                pdf.length.should.be.above(0);

                res.status(status).send(pdf);
            });
        });

        request(app).post('/browser/find?root=%2F').send({"search": "pdf"}).expect(200, done);
    });

    it('POST /browser/find?root=/', function(done){
        var app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.post('/browser/find', function(req, res){
            var browser = req.browser;

            browser.open(browser.root, function(err, list){
                var search = req.body.hasOwnProperty('search') ? req.body.search : null;

                var folder = browser.search(search),
                    status = folder ? 200 : 400;

                folder.length.should.be.above(0);

                res.status(status).send(folder);
            });
        });

        request(app).post('/browser/find?root=%2F').send({"search": "mydocs"}).expect(200, done);
    });

    it('POST /browser/upload?root=/mydocs', function(done){

        var app   = express(),
            image = path.join(__dirname, '..', 'fixtures', 'code-wallpaper-java.png');

        app.use(parted({
            // custom file path
            path: '/tmp',
            // memory usage limit per request
            limit: 30 * 1024,
            // disk usage limit per request
            diskLimit: 30 * 1024 * 1024,
            // enable streaming for json/qs
            stream: false
        }));

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.post('/browser/upload', function(req, res){
            var files   = req.files,
                browser = req.browser;

            browser.add(files.wallpaper.path, browser.root, function(error, file){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                file.should.have.property('name');
                file.should.have.property('path');
                file.should.have.property('ext');
                file.should.have.property('rel');

                fs.unlink(file.path, function(){
                    res.status(status).send(file);
                });
            });
        });

        request(app).post('/browser/upload?root=%2Fmydocs').field('Content-Type', 'multipart/form-data').attach('wallpaper', image).expect(200, done);
    });

    it('GET /browser/create', function(done){

        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser/create', function(req, res){
            var browser = req.browser,
                mode    = req.query.mode;

            browser.create(browser.root, mode, function(error, dir){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                dir.should.be.equal(path.join(__dirname, '..', 'home', browser.root));

                res.status(status).send(dir);
            });
        });

        request(app).get('/browser/create?root=%2Ftemp&mode=0777').expect(200, done);
    });

    it('DELETE /browser/remove', function(done){

        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.delete('/browser/remove', function(req, res){
            var browser = req.browser;

            browser.remove(browser.root, function(error, dir){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                dir.should.be.equal(path.join(__dirname, '..', 'home', browser.root));

                res.status(status).send(dir);
            });
        });

        request(app).delete('/browser/remove?root=%2Ftemp').expect(200, done);
    });

    it('PUT /browser/move', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.put('/browser/move', function(req, res){
            var browser = req.browser,
                from    = req.query.src,
                to      = req.query.dst;

            browser.move(from, to, function(error, rs){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                rs.should.have.property('from', path.join(__dirname, '..', 'home', 'mypics/code-wallpaper-power.jpg'));
                rs.should.have.property('to', path.join(__dirname, '..', 'home', 'mypics/wallpaper-power.jpg'));

                res.status(status).send(rs);
            });
        });

        request(app).put('/browser/move?src=mypics/code-wallpaper-power.jpg&dst=mypics/wallpaper-power.jpg').expect(200, done);
    });

    it('PUT /browser/link', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.put('/browser/link', function(req, res){
            var browser = req.browser,
                from    = req.query.src,
                to      = req.query.dst;

            browser.link(from, to, function(error, rs){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                rs.should.have.property('from', path.join(__dirname, '..', 'home', 'mongodb.pdf'));
                rs.should.have.property('to', path.join(__dirname, '..', 'home', '.secret', 'manual.pdf'));

                res.status(status).send(rs);
            });
        });

        request(app).put('/browser/link?src=mongodb.pdf&dst=.secret%2Fmanual.pdf').expect(200, done);
    });

    it('DELETE /browser/remove', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.delete('/browser/delete', function(req, res){
            var browser = req.browser,
                to      = req.query.dst;

            browser.remove(to, function(error, rs){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                rs.should.be.equal(path.join(__dirname, '..', 'home', '.secret', 'manual.pdf'));

                res.status(status).send(rs);
            });
        });

        request(app).delete('/browser/delete?dst=.secret%2Fmanual.pdf').expect(200, done);
    });

    it('PUT /browser/copy', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.put('/browser/copy', function(req, res){
            var browser = req.browser,
                from    = req.query.src,
                to      = req.query.dst;

            browser.copy(from, to, function(error, rs){
                if(error){
                    status = 400;
                } else {
                    status = 200;
                }

                rs.should.have.property('from', path.join(__dirname, '..', 'home', 'mongodb.pdf'));
                rs.should.have.property('to', path.join(__dirname, '..', 'home', '.secret', 'mg.pdf'));

                res.status(status).send(rs);
            });
        });

        request(app).put('/browser/copy?src=mongodb.pdf&dst=.secret%2Fmg.pdf').expect(200, done);
    });
});