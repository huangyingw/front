#!/bin/zsh
SCRIPT=$(realpath "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd "$SCRIPTPATH"

rm -fr ./node_modules/*
git co ./package-lock.json

npm i && \
    NODE_OPTIONS=--max_old_space_size=5096 npm run build:dev --watch=false
