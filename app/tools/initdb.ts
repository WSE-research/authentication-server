import dotenv from "dotenv";
import fs from "fs-extra";
import { Client } from "pg";

const init = async () => {
  // read environment variables
  dotenv.config();
  // create an instance of the PostgreSQL client
  const client = new Client();
  try {
    // connect to the local database server
    await client.connect();
    // read the contents of the initdb.pgsql file
    const sql: string = await fs.readFile("./tools/initdb.pgsql", { encoding: "UTF-8" });
    // split the file into separate statements
    const statements = sql.split(/;\s*$/m);
    for (const statement of statements) {
      if (statement.length > 3) {
        // execute each of the statements
        await client.query(statement);
      }
    }
  } catch (errorMessage) {
    console.log(errorMessage);
    //throw errorMessage;
  } finally {
    // close the database client
    await client.end();
  }
};

init()
  .then(() => {
    console.log("finished");
  })
  .catch((errorMessage: string) => {
    console.log("finished with errors", errorMessage);
  });
