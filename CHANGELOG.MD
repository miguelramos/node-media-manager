[![Author](https://img.shields.io/badge/author-miguelramos-blue.svg)](https://twitter.com/miguelonspring)
[![Build Status](https://travis-ci.org/miguelramos/node-media-manager.svg?branch=master)](https://travis-ci.org/miguelramos/node-media-manager)
[![Coverage Status](https://coveralls.io/repos/miguelramos/node-media-manager/badge.svg?branch=master)](https://coveralls.io/r/miguelramos/node-media-manager?branch=master)
[![Code Climate](https://codeclimate.com/github/miguelramos/node-media-manager/badges/gpa.svg)](https://codeclimate.com/github/miguelramos/node-media-manager)
[![Test Coverage](https://codeclimate.com/github/miguelramos/node-media-manager/badges/coverage.svg)](https://codeclimate.com/github/miguelramos/node-media-manager)

### 2015-03-26
    - Update README file.
    - Updating package.json to publish to npm.
    - Refactor security breach on middleware tests.
    - Change property current to root on express middleware. Local method isOutside method to check possible security breach. Change emit and callback to emit/call error if present. Process is now responsible to throw callback. Added file nav to structuring navigation (like breadcrumb). Refactor tests to apply new changes.
    - Updating bash script for badges.
    - Update read file and changelog bash script.
    - Local callback add error argument. Tests updated to error argument.
    - Remove search on item type because file name have extension. Tests on local and stat for exceptions.
    - Test for stat exception error.
    - Check how to catch exceptions on mocha.
    - Added changelog. Local open dir should be a relative path to home dir. Prepare to change open absolute dir and find a way to check is not a outside home folder access.
    - Test security breach on express middleware.
    - Refactor folder to local.

### 2015-03-25
    - Change makefile and travis options. Added mocha.opts to add options to mocha tests.
    - Refactor test on travis and makefile to be recursive.
    - Coverage test is going to be on codeclimate and coverall. Badges and modules updated. Added more two tests for internal middleware check.
    - Testing and decide what coverage to use.
    - Some refactors on code style.
    - Correction of wrong var after changing name var for issue #2.
    - Refactor missing new operator for coverage test. Fixes #2.
    - Correction of toString definition. Fixes #3.
    - Missing colon on mim file. Fixes #4.
    - Refactor error styles not passing on coverage tests.
    - Added more geek badges.
    - Codecov badge added.
    - Test coverage reports.
    - Updating twitter wrong link.
    - Updating link on badge author.
    - Added coverall and author badge to read file.
    - Clean index file. Added express test to find folder.
    - Added module body-parser for test on express as dev.  Express middleware browser define a property called current on browser instance to define current folder to list. Added more express tests for middleware.

### 2015-03-24
    - Prepare main function Browser on index. Added to MakeFile test for express. Added devdependencie of express. Init express tests. Added method to mime to reset mimes types to default.
    - Added node 0.12 to travis and removed 0.8 due incompatibles modules.
    - Added test to utils merge deep.
    - Remove merge module to be compatible with node 0.8. Added function merge to utils.
    - Added support for tracis-ci. Test with option check-leaks. Added express file for init middleware support.
    - Index file at the moment point to test. Added merge and string modules. Folder has to have argument home, defining home(base) dir. Added find method to search for file or folder. Added mime property display to check if is visible or hidden. Added function isHidden, only working on *unix systems. Method setMimes and getMimes added. Tests for new increments done it.
    - Transform mime to pattern object and add more methods.
