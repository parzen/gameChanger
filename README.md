|                                          Build release                                           |                                          Unittest release                                           |                                                                   e2e release                                                                    |                                                                  e2e main                                                                  |
| :----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: |
| ![Build Status](https://game-changer-tms.s3.eu-central-1.amazonaws.com/badges/release-Build.svg) | ![Build_Status](https://game-changer-tms.s3.eu-central-1.amazonaws.com/badges/release-Unittest.svg) | [![CircleCI](https://circleci.com/gh/parzen/gameChanger/tree/release.svg?style=shield)](https://circleci.com/gh/parzen/gameChanger/tree/release) | [![CircleCI](https://circleci.com/gh/parzen/gameChanger/tree/main.svg?style=shield)](https://circleci.com/gh/parzen/gameChanger/tree/main) |

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
