"use strict";

/**
 * ██╗    ██╗███████╗██████╗ ███████╗██╗   ██╗██████╗ ██╗     ██╗███╗   ███╗███████╗    ██████╗ ██████╗ ███╗   ███╗
 * ██║    ██║██╔════╝██╔══██╗██╔════╝██║   ██║██╔══██╗██║     ██║████╗ ████║██╔════╝   ██╔════╝██╔═══██╗████╗ ████║
 * ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║██████╔╝██║     ██║██╔████╔██║█████╗     ██║     ██║   ██║██╔████╔██║
 * ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║██╔══██╗██║     ██║██║╚██╔╝██║██╔══╝     ██║     ██║   ██║██║╚██╔╝██║
 * ╚███╔███╔╝███████╗██████╔╝███████║╚██████╔╝██████╔╝███████╗██║██║ ╚═╝ ██║███████╗██╗╚██████╗╚██████╔╝██║ ╚═╝ ██║
 * ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝╚═╝     ╚═╝╚══════╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
 *
 * ----------------------------------------------------------------------------
 * stat.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var mime   = require('../lib/mime'),
    path   = require('path'),
    should = require('should');

describe('#state', function(){
    it('Should have folder properties name, path and type.', function(){
        var stat = mime.stat(path.join(__dirname, 'home'));

        stat.should.have.property('name', 'home');
        stat.should.have.property('path', path.join(__dirname, 'home'));
        stat.should.have.property('type', 'folder');
    });

    it('Should have file properties name, path and type.', function(){
        var stat = mime.stat(path.join(__dirname, 'home', 'mongodb.pdf'));

        stat.should.have.property('name', 'mongodb.pdf');
        stat.should.have.property('path', path.join(__dirname, 'home', 'mongodb.pdf'));
        stat.should.have.property('type', 'pdf');
    });
});