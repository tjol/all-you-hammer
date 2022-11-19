FFMPEG?=ffmpeg

TARGETS=nail1 nail2 nail3 screw

MP3_TARGETS=$(patsubst %,%.mp3,$(TARGETS))
OGG_TARGETS=$(patsubst %,%.ogg,$(TARGETS))

all: $(MP3_TARGETS) $(OGG_TARGETS)

%.ogg: %.wav
	$(FFMPEG) -y -i $< -f ogg $@


%.mp3: %.wav
	$(FFMPEG) -y -i $< -f mp3 $@


clean:
	rm -f $(MP3_TARGETS) $(OGG_TARGETS)


.PHONY: all clean
