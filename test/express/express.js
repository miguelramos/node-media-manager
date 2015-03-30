var should  = require('should'),
    path    = require('path'),
    fs      = require('fs'),
    express = require('express'),
    request = require('supertest'),
    Browser = require('../../'),
    parted  = require('parted'),
    bodyParser = require('body-parser');

describe('#express', function(){
    it('Should have function for middleware.', function(){

        var middleware = Browser.express({
            home: path.join(__dirname, '..', 'home')
        });

        middleware.should.Function;
    });

    it('Should middleware add new property to Browser instance.', function(done){

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

    it('Should request have property browser with value folder instance.', function(done){
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

            browser.open(browser.root, function(err, list){

                list.should.have.property('files');

                (list['files'].length).should.be.above(0);

                res.status(200).send(list);
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

            browser.open(browser.root, function(err, list){
                process.nextTick(function () {
                    err.message.should.equal("Permission denied to access folder outside home.");

                    res.status(200).send({});
                });
            });
        });

        request(app).get('/browser?root=..%2F..%2F..%2F').expect(200, done);
    });

    it('GET /browser?root=/mydocs', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser', function(req, res){
            var browser = req.browser;

            browser.open(browser.root, function(err, list){

                list.should.have.property('files');

                (list['files'].length).should.be.above(0);

                res.status(200).send(list);
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

            browser.open(browser.root, function(err, list){

                list.should.have.property('files');

                (list['files'].length).should.be.above(0);

                res.status(200).send(list);
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

                var pdf = browser.find(search),
                    status = pdf ? 200 : 400;

                pdf.should.have.property('type');

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

                var folder = browser.find(search),
                    status = folder ? 200 : 400;

                folder.should.have.property('type');

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

            browser.add(files.wallpaper.path, browser.root, files.wallpaper.name, function(err, file){
                process.nextTick(function() {
                    fs.unlink(files.wallpaper.path, function(){
                        res.status(200).send(file);
                    });
                });
            });
        });

        request(app).post('/browser/upload?root=%2Fmydocs').field('Content-Type', 'multipart/form-data').attach('wallpaper', image).expect(200, done);
    });

    it('GET /browser/create/dir', function(done){

        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.get('/browser/create/dir', function(req, res){
            var browser = req.browser,
                mode    = req.query.mode;

            browser.mkdir(browser.root, mode, function(err, dir){
                dir.should.be.equal(path.join(__dirname, '..', 'home', browser.root));

                res.status(200).send(dir);
            });
        });

        request(app).get('/browser/create/dir?root=%2Ftemp&mode=0777').expect(200, done);
    });

    it('DELETE /browser/dir', function(done){

        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.delete('/browser/dir', function(req, res){
            var browser = req.browser;

            browser.rmdir(browser.root, function(err, dir){
                dir.should.be.equal(path.join(__dirname, '..', 'home', browser.root));

                res.status(200).send(dir);
            });
        });

        request(app).delete('/browser/dir?root=%2Ftemp').expect(200, done);
    });

    it('PUT /browser/move', function(done){
        var app = express();

        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.put('/browser/move', function(req, res){
            var browser = req.browser,
                from    = req.query.from,
                to      = req.query.to;

            browser.move(from, to, function(err, rs){
                rs.should.have.property('from', path.join(__dirname, '..', 'home', '.secret/wallpaper.jpg'));
                rs.should.have.property('to', path.join(__dirname, '..', 'home', 'mydocs', 'power.jpg'));

                res.status(200).send(rs);
            });
        });

        request(app).put('/browser/move?from=.secret%2Fwallpaper.jpg&to=mydocs%2Fpower.jpg').expect(200, done);
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

            browser.link(from, to, function(err, rs){
                rs.should.have.property('source', path.join(__dirname, '..', 'home', 'mongodb.pdf'));
                rs.should.have.property('destination', path.join(__dirname, '..', 'home', '.secret', 'manual.pdf'));

                res.status(200).send(rs);
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

            browser.remove(to, function(err, rs){
                rs.should.be.equal(path.join(__dirname, '..', 'home', '.secret', 'manual.pdf'));

                res.status(200).send(rs);
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

            browser.copy(from, to, function(err, rs){
                rs.should.have.property('from', path.join(__dirname, '..', 'home', 'mongodb.pdf'));
                rs.should.have.property('to', path.join(__dirname, '..', 'home', '.secret', 'mg.pdf'));

                res.status(200).send(rs);
            });
        });

        request(app).put('/browser/copy?src=mongodb.pdf&dst=.secret%2Fmg.pdf').expect(200, done);
    });
});