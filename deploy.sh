#!/bin/bash

function print_usage() {
  echo "Usage: $0 [arg]"
  echo "arg: "
  echo "  patch :  Increment third digit x.x.2 (default)"
  echo "  minor :  Increment middle digit x.2.x"
  echo "  major :  Increment first digit 2.0.0"
  exit 0
}

if [ "$1" == "-h" ]; then
  print_usage
fi

update_type="patch"
if [ "$1" != "" ]; then
  update_type=$1
fi

if [ "${update_type}" != "major" -a "${update_type}" != "minor" -a "${update_type}" != "patch" ]; then
  echo "Error: Wrong argument!"
  print_usage
fi

git checkout main
git pull
NEW_VERSION=$(npm version ${update_type})
cd backend
npm version ${update_type}
cd..
git commit -am $NEW_VERSION
git push
git checkout release
git pull
git merge main
git push
git checkout main
