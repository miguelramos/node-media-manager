test:
	./node_modules/.bin/mocha --check-leaks --reporter spec

.PHONY: test