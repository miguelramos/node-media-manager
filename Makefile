test:
	./node_modules/.bin/mocha --recursive --check-leaks --reporter spec

.PHONY: test