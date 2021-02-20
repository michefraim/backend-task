# About

An JsonBin type service that works locally on files, built by: Daniel Eliyho and Michael Efraim.
Built using node.js and Express, in addition nodemon and uuid packages used.

## Instructions
`npm install` installs the required packages.
`npm run dev` to run the server using nodemon.
`npm run start` to run the server regularly.

## Features
The server is a JsonBin like service, providing easy and fast Rest API to deal with JSON files.
- `GET` to `localhost:3000/api/v3/b` returns all of the JSON files content.
- `GET` to `localhost:3000/api/v3/b/<ID>` returns the JSON content of a specific file.
- `POST` to `localhost:3000/api/v3/b` creates a new JSON file in jsonFiles with the body of the request.
- `PUT` to `localhost:3000/api/v3/b/<ID>` updates the JSON file with the new content in the body of the request.
- `DELETE` to `localhost:3000/api/v3/b<ID>` deletes the JSON file with the matching ID.


