[![Author](https://img.shields.io/badge/author-miguelramos-blue.svg)](https://twitter.com/miguelonspring)
[![Build Status](https://travis-ci.org/miguelramos/node-media-manager.svg?branch=master)](https://travis-ci.org/miguelramos/node-media-manager)
[![Coverage Status](https://coveralls.io/repos/miguelramos/node-media-manager/badge.svg?branch=master)](https://coveralls.io/r/miguelramos/node-media-manager?branch=master)
[![Code Climate](https://codeclimate.com/github/miguelramos/node-media-manager/badges/gpa.svg)](https://codeclimate.com/github/miguelramos/node-media-manager)
[![Test Coverage](https://codeclimate.com/github/miguelramos/node-media-manager/badges/coverage.svg)](https://codeclimate.com/github/miguelramos/node-media-manager)

### 2015-04-01
    - Updating changelog. Prepare for new tag 0.0.6.
    - Updating Readme file and prepare package.son for next release.
    - Forgot to call done function on after hook. Implemented.
    - Passing wrong way the path directory. Correction.
    - Home path directory wrong. Correction.
    - Change from move to copy and remove old file on after hook.
    - Correction of paths on hook after in express test.
    - Typo correction on name class.
    - Add hook after to express tests.
    - Correction of assertion paths.
    - Update test for coverwalls.
    - Refactor express tests. Update changelog.
    - Docblocks on local functions and methods. Complete local tests and add after hook to clean test directory.
    - Changed test move file to wallpaper, because other test needs the pdf file present on root directory,
    - Correction errors.
    - Added tests to move, copy, link.
    - Clean file. Correction on find method about property files. Refactor copy method to be more simple.
    - Added methods copy, move, link, find and sortBy to local.
    - Coveralls duplicate error.
    - Added tests to create and remove to test security issues.
    - Method create and remove refactor for the new flow. Tests add to local.
    - Method add refactor for new flow. Tests to local added.

### 2015-03-31
    - Local construct assign domain to handle emit events. Function done to treat response from flow. isOutside is now a function and not a method. Tests updated to the new flow.
    - Refactor all Local flow. This should be a major release but after analyze code and flow this should be changed because som patterns are not good. DRY have happen two times. Tests should be more accurate. This build will be broken.
    - Preparing to publish and merge tag 0.0.5.
    - Typo on assert test.
    - Cannot get why is happens only on test to coverwall.
    - Cannot be file to dir. It seems size of file that rename method of fs don't like it. Debugging more about it.
    - Testing if without name this happens.
    - Continue debugging error for coverwall.
    - Express test don't find file on directory.
    - Debugging coverwall test on express move route.
    - Refactor move test of express due error to coverwall.
    - Updating some documentation. Add tests for express and prepare for release 0.0.5.
    - Add method copy for files. Refactor move method. Made tests for local and express.
    - Change move tests directory for unknow directory.
    - Update Changelog. Added test for symbolic method on Local.

### 2015-03-30
    - Method move on Local adjustments and finishing. Added more test about move on Local.
    - Completing method link and add some tests to Local.
    - Clean rmdir expression ternary.
    - Refactor some expression to be more cleared.
    - Added methods move, remove and link to Local. Link is only declared.

### 2015-03-28
    - Prepare for tag 0.0.4. Updated package.son and readme file.
    - Added tests for express in mkdir and rmdir. Update read file.
    - Adde test to mkdir without mode.
    - Added test on local for mkdir, rmdir and errors.
    - Update package.json to 0.0.3 tag.
    - Added method mkdir and rm dir to local.
    - Added version 0.0.3 to read. Prepare to merge to master.
    - Correction of read file.
    - Update read file. Update local tests for argument name.
    - Added parted module package to test upload file. Local add method increment optional name argument. Express test for uploading file.
    - Start upload file tests for express.
    - Add test to fail if folder destination don't exist.
    - Problem was directory didn't exist. Fix #6 issue.
    - Make process writeFile to be called by process.TickNext to check concurrence between read and write.
    - Debugging failure build #50 on travis.
    - Added method to local to add files to home directory. Tests implemented.

### 2015-03-27
    - Update readme version.
    - Version to tag 0.0.2.
    - Fix #5 issue. Prepare to change to branch develop to no more break master. Launching tag 0.0.2.
    - Problem identified. tests run under travis user and is path have home word in path. Check should substring home path and check from home to forward.
    - Debugging travis error.
    - Local test don't fall but travis is failing in security breach.
    - Local permission denied didn't break the flow. Tests updated.
    - Checking why in travis error in security breach is null.
    - Update tests on local to check if nextTick is done it.
    - Update README file for instructions.
    - Added more tests to local check new features. Prepare to pass to branch develop.
    - Final updates to publish package.
    - Changelog update.
    - Update README file.
    - Updating package.json to publish to npm.
    - Refactor security breach on middleware tests.
    - Change property current to root on express middleware. Local method isOutside method to check possible security breach. Change emit and callback to emit/call error if present. Process is now responsible to throw callback. Added file nav to structuring navigation (like breadcrumb). Refactor tests to apply new changes.
    - Updating bash script for badges.
    - Update read file and changelog bash script.
    - Local callback add error argument. Tests updated to error argument.

### 2015-03-26
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
    - Prepare main function Browser on index. Added to MakeFile test for express. Added devdependencie of express. Init express tests. Added method to mime to reset mimes types to default.
    - Added node 0.12 to travis and removed 0.8 due incompatibles modules.
    - Added test to utils merge deep.
    - Remove merge module to be compatible with node 0.8. Added function merge to utils.
    - Added support for tracis-ci. Test with option check-leaks. Added express file for init middleware support.
    - Index file at the moment point to test. Added merge and string modules. Folder has to have argument home, defining home(base) dir. Added find method to search for file or folder. Added mime property display to check if is visible or hidden. Added function isHidden, only working on *unix systems. Method setMimes and getMimes added. Tests for new increments done it.

### 2015-03-24
    - Transform mime to pattern object and add more methods.
    - Init package project. Added initial files folder and mime. Test to this files done in mocha.
    - Initial commit
