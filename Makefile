NPM?=pnpm
INKSCAPE?=inkscape
MAGICK?=magick

all: dist

audio:
	$(MAKE) -C audio

sprites:
	$(MAKE) -C sprites

npm-install:
	$(NPM) install

logo2x.png: logo.svg
	$(INKSCAPE) -w 1400 --export-filename $@ "$<"

all-you-hammer-banner.png: logo2x.png
	$(MAGICK) $< -crop 1200x+100+0 -bordercolor '#401010' -border 0x50 $@


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
	rm -f logo2x.png all-you-hammer-banner.png

.PHONY: audio sprites npm-install deps dist dev preview
