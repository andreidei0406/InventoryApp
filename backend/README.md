# Installation

Run `npm install` to install all necessary dependencies.

## Environment Configuration

Create an env.ts file in the root directory of the project. Add the following variables and replace the placeholders with your own values and also delete "`" accordingly:

`require("dotenv").config();`
`export const env = {`
  `DATABASE_URL:`
  `  process.env.DATABASE_URL ?? "mongodb://localhost:27017/inventory",`
  `INVENTORY_MANAGEMENT: "inventory",`
  `USER_MANAGEMENT: "user",`
  `LOCATION_MANAGEMENT: "location",`
  `CATEGORY_MANAGEMENT: "category",`
  `PORT: 3000`
`};`

## Start the MongoDB Server
Ensure that your MongoDB server is running. If you’re using a local installation, start it with the following command:
  In normal termial type `mongod`

## Run the Server
Start the server with the following command: 
  `npm run start`

The server will start and listen on the port specified in the env.ts file (default: 3000).

You should see the following message in the console:
  `Connected to Database`
  `Server started on PORT 3000`

## Access
http://localhost:<PORT>
Replace <PORT> with the port defined in your env.ts file (default: 3000).

## Routes
Endpoint	  HTTP Method	Description
/inventory	Various	Manage inventory items
/user	      Various	Manage users
/location	  Various	Manage inventory locations
/category	  Various	Manage inventory categories
