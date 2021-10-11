#!/bin/bash

function print_usage() {
  echo "Usage: $0 [arg]"
  echo "arg: "
  echo "  local  :  Use local mongo installation"
  echo "  docker :  Use mongo docker image (default)"
  exit 0
}

if [ "$1" == "-h" ]; then
  print_usage
fi

mongo_installation="docker"
if [ "$1" != "" ]; then
  mongo_installation=$1
fi

echo ">>> Running mongodb server"
if [ "${mongo_installation}" = "local" ]; then
  echo ">>>> Local installation"
  # With local installation (perhaps need sudo)
  cmd="mongod --version"
  echo $cmd
  eval $cmd
  cmd="service mongodb start"
  echo $cmd
  eval $cmd
  cmd="service mongodb status"
  echo $cmd
  eval $cmd
  cmd="mongo --eval 'db.runCommand({ connectionStatus: 1 })'"
  echo $cmd
  eval $cmd
elif [ "${mongo_installation}" = "docker" ]; then
  echo ">>>> Docker installation"
  # Create mongo docker
  #sudo docker run -d --name mongo-on-docker \
  #  -p 27017:27017 \
  #  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
  #  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  #  mongo

  # Start docker
  cmd="sudo docker start mongo-on-docker"
  echo $cmd
  eval $cmd
else
  echo "Error: Wrong argument!"
  print_usage
fi

echo ">>> Starting backend server"
cd backend
cmd="npm run start:testing &"
echo $cmd
eval $cmd
cd ..

echo ">>> Starting frontend server and e2e test"
cmd="npm run e2e:ci"
echo $cmd
eval $cmd

echo ">>> Stopping backend server"
npm i kill-port
npx kill-port 3000
