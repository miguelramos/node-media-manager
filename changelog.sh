#!/bin/bash
AUTHOR=$(git config user.name)
DATE=$(date +%F)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILE="$DIR/CHANGELOG.MD"

echo "#CHANGELOG ON" $DATE > $FILE
echo "=============" > $FILE

echo "[![Author](https://img.shields.io/badge/author-miguelramos-blue.svg)](https://twitter.com/miguelonspring)
[![Build Status](https://travis-ci.org/miguelramos/node-media-manager.svg?branch=master)](https://travis-ci.org/miguelramos/node-media-manager)
[![Coverage Status](https://coveralls.io/repos/miguelramos/node-media-manager/badge.svg?branch=master)](https://coveralls.io/r/miguelramos/node-media-manager?branch=master)
[![Code Climate](https://codeclimate.com/github/miguelramos/node-media-manager/badges/gpa.svg)](https://codeclimate.com/github/miguelramos/node-media-manager)
[![Test Coverage](https://codeclimate.com/github/miguelramos/node-media-manager/badges/coverage.svg)](https://codeclimate.com/github/miguelramos/node-media-manager)" > $FILE

git log --no-merges --format="%cd" --date=short --no-merges --author="$AUTHOR" --all | sort -u -r | while read DATE ; do
  if [[ $NEXT != "" ]]
  then
    echo >> $FILE
    echo "###" $NEXT >> $FILE
  fi
  GIT_PAGER=cat git log --no-merges --format="    - %s" --since=$DATE --until=$NEXT --author="$AUTHOR" --all >> $FILE
  NEXT=$DATE
done