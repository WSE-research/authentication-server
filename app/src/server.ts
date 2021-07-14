import { Client } from "pg";
import fs from "fs";

const routes = require("./routes/routes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const privKey = fs.readFileSync('./jwtRS256.key', { encoding: 'utf8' });

// initialize configuration
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

async function testConnection() {
  let retries = 5;
  const client = new Client();
  while (retries) {
    try {
      client.connect();
      client.end();
      console.log("Connected to db successfully");
      break;
    } catch (errorMessage) {
      console.error(errorMessage);
      retries -= 1;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

testConnection().then(() => {
  require("./initdb");
})



// CORS
/*
const config = require("../../config.json");
CORS should usually be configured very neatly for security reasons.
In this case, we just allow it for everyone to prevent problems.

const corsOptions = {
  origin: config["allow-origins-cors"],
};

app.use(cors(corsOptions));
*/

app.use(cors());
app.use(express.json());

routes(app, privKey);

app.listen(port, () => {
  console.log(`listening on ${process.env.BASE_URL}:${port}`);
});
