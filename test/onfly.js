"use strict";

/**
 *
 * ----------------------------------------------------------------------------
 * onfly.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var Local  = require('../lib/local'),
    path   = require('path'),
    should = require('should');

describe('#development', function(){
    it('Debugging', function(done){
        var folder = new Local(path.join(__dirname, 'home'));

        /*folder.rmdir("tmp", function(err, rs){
            if(err) {
                done(err);
                return;
            }

            (1).should.be.above(0);

            done();
        });*/
        done();
    });
});