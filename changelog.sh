#!/bin/bash
AUTHOR=$(git config user.name)
DATE=$(date +%F)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILE="$DIR/CHANGELOG.MD"
echo "#CHANGELOG ON" $DATE > $FILE

git log --no-merges --format="%cd" --date=short --no-merges --author="$AUTHOR" --all | sort -u -r | while read DATE ; do
  if [[ $NEXT != "" ]]
  then
    echo >> $FILE
    echo "###" $NEXT >> $FILE
  fi
  GIT_PAGER=cat git log --no-merges --format="    - %s" --since=$DATE --until=$NEXT --author="$AUTHOR" --all >> $FILE
  NEXT=$DATE
done