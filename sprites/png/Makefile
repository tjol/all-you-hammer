MONTAGE?=magick montage

NAIL_PNGS=$(patsubst %,nails-and-screws/%,$(shell $(MAKE) -sC nails-and-screws nail-list))
SCREW_PNGS=$(patsubst %,nails-and-screws/%,$(shell $(MAKE) -sC nails-and-screws screw-list))

SVG_DIR=../svg

all: nails.png screws.png drop-hammer.png nail-head.png restart-btn.png tilt-btn.png

nails.png: nail-and-screw-pngs
	$(MONTAGE) -tile x1 -geometry +0+0 -background none $(NAIL_PNGS) $@ 

screws.png: nail-and-screw-pngs
	$(MONTAGE) -tile x1 -geometry +0+0 -background none $(SCREW_PNGS) $@ 

drop-hammer.png: $(SVG_DIR)/drop-hammer.svg
	$(INKSCAPE) -w 650 --export-filename $@ "$<"

nail-head.png: $(SVG_DIR)/nail-head.svg
	$(INKSCAPE) -w 70 --export-filename $@ "$<"

%-btn.png: $(SVG_DIR)/%-btn.svg
	$(INKSCAPE) -w 300 --export-filename $@ "$<"

nail-and-screw-pngs:
	$(MAKE) -C nails-and-screws

clean:
	$(MAKE) -C nails-and-screws clean
	rm -f nails.png screws.png drop-hammer.png nail-head.png

.PHONY: all clean nail-and-screw-pngs
.NOTPARALLEL: all
