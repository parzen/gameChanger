#!/bin/bash

cd backend
npm run start:testing &
cd ..
npm start
