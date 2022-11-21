NPM?=pnpm
INKSCAPE?=inkscape
CONVERT?=convert

all: dist

audio:
	$(MAKE) -C audio

sprites:
	$(MAKE) -C sprites

npm-install:
	$(NPM) install

logo2x.png: logo.svg
	$(INKSCAPE) -w 1400 --export-filename logo2x.wide.png "$<"
	$(CONVERT) logo2x.wide.png -crop 1037x+179+0 $@

all-you-hammer-banner.png: logo2x.png
	$(CONVERT) $< -crop 1200x+100+0 -bordercolor '#401010' -border 0x50 $@


deps: audio images npm-install
images: sprites logo2x.png

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
	rm -f all-you-hammer-banner.png logo2x.wide.png

.PHONY: audio sprites images npm-install deps dist dev preview
.NOTPARALLEL: images
