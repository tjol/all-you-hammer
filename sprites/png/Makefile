MONTAGE?=montage
CONVERT?=convert
INKSCAPE?=inkscape

SVG_DIR=../svg

all: nails.png screws.png drop-hammer.png nail-head.png \
	restart-btn.png tilt-btn.png start-btn.png next-level.png \
	fullscreen.png logo.png logo2x.png

nails.png: nail-and-screw-pngs nails-and-screws/nails.lst
	$(MONTAGE) -tile x1 -geometry +0+0 -background none \
		$(patsubst %,nails-and-screws/%,$(shell cat nails-and-screws/nails.lst)) $@

screws.png: nail-and-screw-pngs nails-and-screws/screws.lst
	$(MONTAGE) -tile x1 -geometry +0+0 -background none \
		$(patsubst %,nails-and-screws/%,$(shell cat nails-and-screws/screws.lst)) $@

drop-hammer.png: $(SVG_DIR)/drop-hammer.svg
	$(INKSCAPE) -w 650 --export-filename $@ "$<"

nail-head.png: $(SVG_DIR)/nail-head.svg
	$(INKSCAPE) -w 70 --export-filename $@ "$<"

%-btn.png: $(SVG_DIR)/%-btn.svg
	$(INKSCAPE) -w 300 --export-filename $@ "$<"

next-level.png: $(SVG_DIR)/next-level.svg
	$(INKSCAPE) -w 800 --export-filename $@ "$<"

fullscreen.png: $(SVG_DIR)/fullscreen.svg
	$(INKSCAPE) -w 96 --export-filename $@ "$<"

logo.png: $(SVG_DIR)/logo.svg
	$(INKSCAPE) -w 700 --export-filename $@ "$<"

logo2x.png: $(SVG_DIR)/logo.svg
	$(INKSCAPE) -w 1400 --export-filename logo2x.wide.png "$<"
	$(CONVERT) logo2x.wide.png -crop 1037x+179+0 $@

all-you-hammer-banner.png: logo2x.png
	$(CONVERT) $< -crop 1200x+100+0 -bordercolor '#401010' -border 0x50 $@

nails-and-screws/nails.lst: nails-and-screws/Makefile
	$(MAKE) -C nails-and-screws nails.lst

nails-and-screws/screws.lst: nails-and-screws/Makefile
	$(MAKE) -C nails-and-screws screws.lst

nail-and-screw-pngs:
	$(MAKE) -C nails-and-screws

clean:
	$(MAKE) -C nails-and-screws clean
	rm -f nails.png screws.png drop-hammer.png nail-head.png

.PHONY: all clean nail-and-screw-pngs
.NOTPARALLEL: all
