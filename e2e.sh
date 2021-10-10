#!/bin/bash

function print_usage() {
  echo "Usage: $0 [arg]"
  echo "arg: "
  echo "  local  :  Use local mongo installation"
  echo "  docker :  Use mongo docker image (default)"
  exit 0
}

if [ "$1" == "-h" ]
then
  print_usage
fi

mongo_installation="docker"
if [ "$1" != "" ]
then
  mongo_installation=$1
fi


echo ">>> Running mongodb server"
if [ "${mongo_installation}" = "local" ]
then
  # With local installation (perhaps need sudo)
  mongod --version
  sudo systemctl start mongod
  sudo systemctl status mongod
elif [ "${mongo_installation}" = "docker" ]
then
  # Create mongo docker
  #sudo docker run -d --name mongo-on-docker \
  #  -p 27017:27017 \
  #  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
  #  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  #  mongo

  # Start docker
  sudo docker start mongo-on-docker
else
  echo "Error: Wrong argument!"
  print_usage
fi

echo ">>> Starting backend server"
cd backend
npm run start:testing &
cd ..

echo ">>> Starting frontend server and e2e test"
npm run e2e:ci
