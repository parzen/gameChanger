


|Build release|e2e main|e2e release|
|:-:|:-:|:-:|
|![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiWXdoTE9DbUg1NXM1OEpBMzB6UzJlUEw5cjFwdi92YURVWDc4bVdxck5ZR1V4WTJZUjByY2hTQnNiRVpwQ2Y0cmhGWFRPaXpEbjRvTzJPdTBva1l0ang4PSIsIml2UGFyYW1ldGVyU3BlYyI6Ii9RaVl2ZXJ2YnNER0JLYlIiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)|[![CircleCI](https://circleci.com/gh/parzen/gameChanger/tree/main.svg?style=shield)](https://circleci.com/gh/parzen/gameChanger/tree/main)|[![CircleCI](https://circleci.com/gh/parzen/gameChanger/tree/release.svg?style=shield)](https://circleci.com/gh/parzen/gameChanger/tree/release)|

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Backend server

`cd backend` and run `npm run start` for the backend server.

## Deploy

Run `./deploy.sh` to deploy a new package.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running e2e test

Run `./e2e.sh`. This script start local mongoDb server, start development/backend server and run cypress e2e test
