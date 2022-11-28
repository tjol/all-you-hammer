NPM?=pnpm
PACKAGE_NAME=$(shell python3 -c 'import json; print(json.load(open("package.json"))["name"])')
PACKAGE_VERSION=$(shell python3 -c 'import json; print(json.load(open("package.json"))["version"])')
ZIPFILE=$(PACKAGE_NAME)-$(PACKAGE_VERSION).zip

all: dist
zip: $(ZIPFILE)

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

$(ZIPFILE): dist
	rm -rf dist_zip && mkdir dist_zip
	cp -rl dist/assets dist_zip
	cp -l dist/game.html dist_zip/index.html
	rm -f $(ZIPFILE) && cd dist_zip && zip -r ../$(ZIPFILE) assets index.html

clean:
	$(MAKE) -C audio clean
	$(MAKE) -C sprites clean
	rm -rf dist dist_zip

.PHONY: audio sprites npm-install deps dist dev preview zip
.NOTPARALLEL: images
