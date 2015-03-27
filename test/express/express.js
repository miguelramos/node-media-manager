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

        app.use(bodyParser());
        app.use(Browser.express({
            home: path.join(__dirname, '..', 'home')
        }));

        app.post('/browser/upload', function(req, res){
            /*var multipart = require('multipart');

            var _upload = function(request, response) {
                debugger;
                request.setBodyEncoding('binary');

                var stream = new multipart.Stream(request);

                stream.addListener('part', function(part) {
                    part.addListener('body', function(chunk) {
                        var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
                        var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);

                        //sys.print("Uploading "+mb+"mb ("+progress+"%)\015");

                        // chunk could be appended to a file if the uploaded file needs to be saved
                    });
                });

                stream.addListener('complete', function() {
                    response.status(200).send({ success: true });
                });
            }

            process.nextTick(function () {
                _upload(req, res);
            });*/
            response.status(200).send({ success: true });
        });

        request(app).post('/browser/upload?root=%2Fmydocs').attach('wallpaper', image).expect(200, done);
    });
});