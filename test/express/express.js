var should  = require('should'),
    path    = require('path'),
    express = require('express'),
    request = require('supertest'),
    Browser = require('../../');

describe('#express', function(){
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

    /*it('GET /browser', function(done){
        var app = express();

        app.get('/browser', function(req, res){
            res.status(200).send({ name: 'tobi' });
        });

        request(app)
            .get('/browser')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });*/
});