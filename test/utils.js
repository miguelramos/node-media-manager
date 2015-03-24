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
 * utils.js
 * ----------------------------------------------------------------------------
 *
 * This file is part of browser Project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var should = require('should'),
    utils  = require('../lib/utils');

describe('#utils', function(){
    it('Should merge deep objects.', function(){
        var a = {
            "p1": "p1a",
            "p2": [
                "a",
                "b",
                "c"
            ],
            "p3": true,
            "p5": null,
            "p6": {
                "p61": "p61a",
                "p62": "p62a",
                "p63": [
                    "aa",
                    "bb",
                    "cc"
                ],
                "p64": {
                    "p641": "p641a"
                }
            }
        };

        var b = {
            "p1": "p1b",
            "p2": [
                "d",
                "e",
                "f"
            ],
            "p3": false,
            "p4": true,
            "p6": {
                "p61": "p61b",
                "p64": {
                    "p642": "p642b"
                }
            }
        };

        var merged = utils.merge(a, b);

        merged.should.have.property('p1').eql('p1b');
        merged.should.have.property('p2').eql(['d', 'e', 'f']);
        merged.should.have.property('p3').eql(false);
        merged.should.have.property('p4').eql(true);
    });
});