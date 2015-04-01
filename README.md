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

## Events

* All except search and sortBy:
    - error
    - finish

## Usage

    var Browser = require('node-media-manager')
        path    = require('path');

    var browser = Browser({home: __dirname, mimes: { "js": ["js"] }});
    var image   = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

    //With callback
    browser.open("/node_modules", function(err, list){
        console.log(list);
    });

    //Catch emited errors
    browser.on('error', function(error){
        console.log(file);
    });

    //With callback
    browser.on('finish', function(err, list){
        console.log(list);

        //You can find files by name, extension or folders.
        var findIt = browser.search('pdf');

        //Or sort
        var sort = browser.sortBy('pdf');
    });

    //Add/insert file
    browser.on('finish', function(err, file){
        console.log(file);
    });

    browser.add(image, 'mydocs');

    //Create a directory
    browser.create('tmp', '0777', function(err, dir){
        console.log(dir);
    });

    //Delete directory/files
    browser.on('finish', function(err, dir){
        console.log(dir);
    });

    browser.remove('temp');

    //Move directories or files
    browser.on('finish', function(err, paths){
        console.log(paths);
    });

    browser.move('mydocs', '.secret/tmp');

    //Symbolic link directories or files
    browser.on('finish', function(err, paths){
        console.log(paths);
    });

    browser.link('mongodb.pdf', 'mydocs/manual.pdf');

    //Copy file
    browser.on('finish', function(err, rs){
        console.log(rs);
    });

    browser.copy('mongodb.pdf', 'mydocs/mongo.pdf');

### Response Example:

    // List Directory
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

### For express integration and how to.

    var app   = express(),
        image = path.join(__dirname, 'fixtures', 'code-wallpaper-power.jpg');

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

    //Request: POST /browser/upload?root=/mydocs
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

    //Create directory
    app.get('/browser/create', function(req, res){
        var browser = req.browser,
            mode    = req.query.mode;

        browser.create(browser.root, mode, function(err, dir){
            res.status(200).send(dir);
        });
    });

    //Move file or directory
    app.put('/browser/move?from=mypics&to=mydocs/pics', function(req, res){
        var browser = req.browser,
            from    = req.query.from,
            to      = req.query.to;

        browser.move(from, to, function(err, rs){
            res.status(200).send(rs);
        });
    });

    //Create symbolic link folder or file
    app.put('/browser/link?src=mongodb.pdf&dst=.secret/manual.pdf', function(req, res){
        var browser = req.browser,
            from    = req.query.src,
            to      = req.query.dst;

        browser.link(from, to, function(err, rs){
            res.status(200).send(rs);
        });
    });

    //Remove directories or files
    app.delete('/browser/delete?dst=.secret/manual.pdf', function(req, res){
        var browser = req.browser,
            to      = req.query.dst;

        browser.remove(to, function(err, rs){
            res.status(200).send(rs);
        });
    });

    //Copy files (only)
    app.put('/browser/copy?src=mongodb.pdf&dst=.secret/mg.pdf', function(req, res){
        var browser = req.browser,
            from    = req.query.src,
            to      = req.query.dst;

        browser.copy(from, to, function(err, rs){
            res.status(200).send(rs);
        });
    });

## Tests

    npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.0.6 Refactor all flow and apply best pratices
* 0.0.5 New methods remove, move, copy and link.
* 0.0.4 New methods mkdir and rmdir on Local.
* 0.0.3 New method add files on Local.
* 0.0.2 Fixing security check
* 0.0.1 Initial release

## Node Compatibility

* 0.10
* 0.11
* 0.12