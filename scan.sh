#!/bin/env sh
scanimage --mode Color --resolution 100 > sprite-raw.pnm
convert sprite-raw.pnm \
  -fuzz 20% -transparent "#e1b538" \
  -crop 590x905+10+13 +repage \
  sprite.png
