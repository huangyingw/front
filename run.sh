#!/bin/zsh
SCRIPT=$(realpath "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd "$SCRIPTPATH"

npm i \
    crypto-js \
    http \
    -S

npm rebuild node-sass
npm i && \
    NODE_OPTIONS=--max_old_space_size=5096 npm run build:dev --watch=false
    # NODE_OPTIONS=--max_old_space_size=5096 npx ng run minds:server:production
    # NODE_OPTIONS=--max_old_space_size=5096 ENGINE_PORT=8080 npm run serve:dev