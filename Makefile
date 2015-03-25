test:
	./node_modules/.bin/mocha --check-leaks --reporter spec
	./node_modules/.bin/mocha ./test/express/express.js --check-leaks --reporter spec
	./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec   && cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js   && rm -rf ./coverage

.PHONY: test