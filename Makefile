test:
	./node_modules/.bin/mocha --check-leaks --reporter spec
	./node_modules/.bin/mocha ./test/express/express.js --check-leaks --reporter spec

.PHONY: test