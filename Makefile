NPM?=pnpm
INKSCAPE?=inkscape

all: dist

audio:
	$(MAKE) -C audio

sprites:
	$(MAKE) -C sprites

npm-install:
	$(NPM) install

logo2x.png: logo.svg
	$(INKSCAPE) -w 1400 --export-filename $@ "$<"

deps: audio sprites logo2x.png npm-install

dist: deps
	$(NPM) run build

dev: deps
	$(NPM) run dev

preview: deps
	$(NPM) run preview

clean:
	$(MAKE) -C audio clean
	$(MAKE) -C sprites clean
	rm -rf dist

.PHONY: audio sprites npm-install deps dist dev preview
