![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiWXdoTE9DbUg1NXM1OEpBMzB6UzJlUEw5cjFwdi92YURVWDc4bVdxck5ZR1V4WTJZUjByY2hTQnNiRVpwQ2Y0cmhGWFRPaXpEbjRvTzJPdTBva1l0ang4PSIsIml2UGFyYW1ldGVyU3BlYyI6Ii9RaVl2ZXJ2YnNER0JLYlIiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)

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

1. Start mongo server: `cd backend` and run `./start_db.sh`
2. Run backend server: `cd backend` and run `npm run start:testing`
3. Run development server: `ng serve`
4. Start cypress e2e test: `npm run cy:run`
