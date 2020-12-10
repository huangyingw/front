#!/bin/zsh
SCRIPT=$(realpath "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd "$SCRIPTPATH"

NODE_OPTIONS=--max_old_space_size=4096 ENGINE_PORT=8080 npm run serve:dev -- --live-reload=false
