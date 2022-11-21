NPM?=pnpm

all: dist

audio:
	$(MAKE) -C audio

sprites:
	$(MAKE) -C sprites

npm-install:
	$(NPM) install

deps: audio sprites npm-install

dist: deps
	$(NPM) run build

dev: deps
	$(NPM) run dev

preview: dist
	$(NPM) run preview

clean:
	$(MAKE) -C audio clean
	$(MAKE) -C sprites clean
	rm -rf dist

.PHONY: audio sprites npm-install deps dist dev preview
.NOTPARALLEL: images
