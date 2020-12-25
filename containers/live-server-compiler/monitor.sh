#!/usr/bin/env sh
set -e

cd /var/www/Minds/front/
rm -fr node_modules/* 
rm package-lock.json

npm i yargs --save
npm i && \
    NODE_OPTIONS=--max_old_space_size=5096 npm run build:dev --watch=false
