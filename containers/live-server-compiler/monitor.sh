#!/usr/bin/env sh
set -e

cd /var/www/Minds/front
# npx nodemon --delay 3 --watch server.ts --watch dist/en/ --ext js,css,jpg,png,svg,mp4,webp,webm  --exec "/usr/bin/env sh" /build.sh
npm rebuild node-sass
NODE_OPTIONS=--max_old_space_size=5096 npm run build:dev --watch=false
