import jwt from "jsonwebtoken";
import { Client } from "pg";
import { ErrorResponses } from "../../defaultResponses";
import handleError from "../../helpers/handleError";
import DBInterfaces from "../../interfaces/DBInterfaces";

export default async (req: any, res: any, privKey: string) => {
  const { state } = req.query;
  if (!state) {
    res.status(400).json(ErrorResponses.NoState);
    return;
  }

  const client = new Client();

  try {
    await client.connect();

    const authData: DBInterfaces.AuthData = (
      await client.query("SELECT * FROM auth_data WHERE csrfToken=$1::text;", [
        state,
      ])
    ).rows[0];

    const authToken = jwt.sign(
      {
        username: authData.gitlabusername,
      },
      privKey,
      { algorithm: "RS256", expiresIn: "10m" }
    );

    if (!!authToken) {
      res.status(200).json({
        token: authToken,
      });
    } else {
      res.status(401).json(ErrorResponses.NoAuthenticationForSession);
    }
  } catch (errorMessage) {
    handleError(req, res, errorMessage);
  } finally {
    await client.end();
  }
};
