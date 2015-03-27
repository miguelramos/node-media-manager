Node Media Manager
==================

[![Author](https://img.shields.io/badge/author-miguelramos-blue.svg)](https://twitter.com/miguelonspring)
[![Build Status](https://travis-ci.org/miguelramos/node-media-manager.svg?branch=master)](https://travis-ci.org/miguelramos/node-media-manager)
[![Coverage Status](https://coveralls.io/repos/miguelramos/node-media-manager/badge.svg?branch=master)](https://coveralls.io/r/miguelramos/node-media-manager?branch=master)
[![Code Climate](https://codeclimate.com/github/miguelramos/node-media-manager/badges/gpa.svg)](https://codeclimate.com/github/miguelramos/node-media-manager)
[![npm version](https://badge.fury.io/js/node-media-manager.svg)](http://badge.fury.io/js/node-media-manager)
[![NPM](https://nodei.co/npm/node-media-manager.png)](https://nodei.co/npm/node-media-manager/)

Node Media Manager is a library to browse a specific directory, like home. Is intend to get list of contents in a directory. Expressjs
is supported. Work in progress.

## Installation

    npm install node-media-manager --save

## Options
    home: Home directory
    mimes: Register mimes types

    Default mimes:
        {
            'compressed' : ['zip', 'rar', 'gz', 'tar'],
            'text'       : ['txt', 'md', 'nfo'],
            'image'      : ['jpg', 'jpge', 'png', 'gif', 'bmp', 'svg'],
            'pdf'        : ['pdf'],
            'css'        : ['css'],
            'html'       : ['html'],
            'word'       : ['doc', 'docx'],
            'powerpoint' : ['ppt', 'pptx'],
            'movie'      : ['mkv', 'avi', 'rmvb', 'mpeg', 'wmv']
        }

## Usage

    var Browser = require('node-media-manager');

    var browser = Browser({home: __dirname, mimes: { "js": ["js"] }});

    //With callback
    browser.open("/node_modules", function(err, list){
        console.log(list);
    });

    //With event emitter
    browser.on('onRead', function(err, list){
        console.log(list);

        //You can find files by name, extension and folders.
        var findIt = browser.find('pdf');
    });

### Response:

    { files:
        [
            {
                name: 'node-media-manager',
                path: '/Projects/test/node_modules/node-media-manager',
                display: 'visible',
                type: 'folder',
                relative: 'node_modules/node-media-manager'
            }
        ],
        template: '<a data-type="folder" data-path="node_modules/node-media-manager" class="">node-media-manager</a>',
        paths: {
            home: '/Projects/test',
            current: '/Projects/test/node_modules',
            relative: 'node_modules',
            parent: '..'
        }
    }

### For express integration.

    var app = express();

    app.use(Browser.express({home: __dirname, mimes: { "js": ["js"] }}));

    app.get("/browser", function(req, res, next){

        //Instance is present in request
        var browser = req.browser;

        //root parameter to navigate thru home folder
        browser.open(browser.root, function(err, list){
            if(err){
                return console.log(err);
            }

            res.status(200).send(list);
        });
    });

    app.get("/browser?root=/node_modules", function(req, res, next){
        var browser = req.browser;

        //Navigate inside home to directory node_modules
        browser.open(browser.root, function(err, list){
            if(err){
                return console.log(err);
            }

            res.status(200).send(list);
        });
    });

    //You can go foward and backaward, but not outside home folder
    app.get("/browser?root=../", function(req, res, next){
        var browser = req.browser;

        browser.open(browser.root, function(err, list){
            if(err){
                return console.log(err);
            }

            res.status(200).send(list);
        });
    });

## Tests

    npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.0.1 Initial release