#!/bin/bash

function print_usage() {
  echo "Usage: $0 [mongo arg]"
  echo "mongo: "
  echo "  local  :  Use local mongo installation"
  echo "  docker :  Use mongo docker image (default)"
  echo "arg: "
  echo "  nosudo :  Dont' use sudo command"
  exit 0
}

function call_cmd() {
  echo ">>>>> CMD: $1"
  eval $1
}

if [ "$1" == "-h" ]; then
  print_usage
fi

mongo_installation="docker"
if [ "$1" != "" ]; then
  mongo_installation=$1
fi

sudo="sudo"
if [ "$2" == "nosudo" ]; then
  sudo=""
fi

echo ">>> Running mongodb server"
if [ "${mongo_installation}" = "local" ]; then
  echo ">>>> Local installation"
  # With local installation
  call_cmd "uname --all"
  call_cmd "$sudo mongod --version"
  call_cmd "$sudo service mongodb start"
  call_cmd "$sudo service mongodb status"
  call_cmd "$sudo start mongod"
  call_cmd "$sudo mongo --eval 'db.runCommand({ connectionStatus: 1 })'"
  call_cmd "$sudo mongo --eval 'db.createUser({ user: \"mongoadmin\", pwd: \"secret\" ]})'"
elif [ "${mongo_installation}" = "docker" ]; then
  echo ">>>> Docker installation"
  # Start docker daemon
  #call_cmd "$sudo dockerd"

  # Get mongo docker image
  #call_cmd "$sudo docker pull mongo"

  # Create mongo docker
  call_cmd "$sudo docker run -d --name mongo-on-docker -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo"

  # Start docker
  call_cmd "$sudo docker start mongo-on-docker"
else
  echo "Error: Wrong argument!"
  print_usage
fi

echo ">>> Starting backend server"
cd backend
call_cmd "npm run start:testing &"
cd ..

echo ">>> Starting frontend server and e2e test"
call_cmd "npm run e2e"

echo ">>> Stopping backend server"
call_cmd "kill -9 $(ps aux | grep nodemon | grep 'node ' | awk '{print $2}')"
call_cmd "kill -9 $(lsof -i tcp:3000 | grep 3000 | awk '{print $2}')"
