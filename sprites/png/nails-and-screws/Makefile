INKSCAPE?=inkscape
NAIL_SVG_DIR=../../svg/nails-and-screws

NAIL_PNGS=$(patsubst %.svg,%.png,$(notdir $(wildcard $(NAIL_SVG_DIR)/*.svg)))

all: pngs

pngs: $(NAIL_PNGS)

clean:
	rm -f $(NAIL_PNGS)

%.png: $(NAIL_SVG_DIR)/%.svg
	$(INKSCAPE) -w 150 --export-filename $@ "$<"

# Utility targets for use in parent makefiles

png-list:
	@echo $(NAIL_PNGS)

nail-list:
	@echo $(sort $(filter nail%,$(NAIL_PNGS)))

screw-list:
	@echo $(sort $(filter screw%,$(NAIL_PNGS)))

# Instructions for GNU make

.PHONY: all pngs png-list nail-list screw-list
.NOTPARALLEL: pngs
