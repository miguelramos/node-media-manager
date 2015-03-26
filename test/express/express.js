var should  = require('should'),
    path    = require('path'),
    express = require('express'),
    request = require('supertest'),
    Browser = require('../../'),
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
                if(err){
                    err.message.should.equal("Permission denied to access folder outside home.");
                }

                res.status(200).send({});
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
});