MONTAGE?=montage
INKSCAPE?=inkscape

SVG_DIR=../svg

all: nails.png screws.png drop-hammer.png nail-head.png restart-btn.png tilt-btn.png

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
