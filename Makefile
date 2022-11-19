NPM?=pnpm

all: dist

audio:
	$(MAKE) -C audio

sprites:
	$(MAKE) -C sprites

dist: audio sprites
	$(NPM) run build

clean:
	$(MAKE) -C audio clean
	rm -rf dist

.PHONY: audio sprites dist
