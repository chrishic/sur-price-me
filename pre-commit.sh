#!/bin/bash

node_modules/.bin/grunt --config Gruntfile.js build

if [ $? -gt 1 ]; then
  echo "";
  echo "Errors found; commit has been aborted.";
  exit 1
fi
