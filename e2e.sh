#!/bin/bash

cd backend

echo ">>> Running local mongodb"
./start_db.sh

echo ">>> Starting backend server"
npm run start:testing

cd ..
echo ">>> Starting frontend server and e2e test"
npm run e2e:ci
