import { Client } from "pg";
import { ErrorResponses } from "../../defaultResponses";
import DBInterfaces from "../../interfaces/DBInterfaces";
import axios from "axios";
import handleError from "../../helpers/handleError";

export default async (req: any, res: any) => {
  const params = req.query;
  if (!params.state) {
    res.status(400).json(ErrorResponses.NoState);
    return;
  }

  const client = new Client();

  try {
    await client.connect();

    const authData: DBInterfaces.AuthData = (
      await client.query("SELECT * FROM auth_data WHERE csrfToken=$1::text;", [
        params.state,
      ])
    ).rows[0];
    if (!authData || !authData.codeverifier) {
      res.status(400).json(ErrorResponses.NoAuthenticationForSession);
      return;
    }

    const redirect_uri = `${req.protocol}://${req.get("host")}/generateToken`;
    const body = {
      client_id: process.env.GITLAB_APP_ID,
      client_secret: process.env.GITLAB_CLIENT_SECRET,
      code: params.code,
      grant_type: "authorization_code",
      redirect_uri,
      code_verifier: authData.codeverifier,
    };

    const tokenDataResponse = await axios.post(
      process.env["GITLAB_TOKEN_URL"],
      body
    );
    if (!tokenDataResponse?.data) {
      res.send("Something went wrong. Please close the tab and try again.");
      return;
    }
    /*
    Es gibt leider keinen Wert 'expires_in', weswegen nicht refresht werden kann.
    
    setInterval(() => {
        query("DELETE FROM auth_data WHERE state=$1::text;", [params.state]);
    }, !!response.data.expires_in ? +response.data.expires_in : 7200);
    */

    const userDataResponse = await axios.get(
      "https://gitlab.hs-anhalt.de/api/v4/user",
      {
        headers: {
          Authorization: `Bearer ${tokenDataResponse.data.access_token}`,
        },
      }
    );

    if (!userDataResponse?.data) {
      res.send("Something went wrong. Please close the tab and try again.");
      return;
    }

    await client.query(
      "UPDATE auth_data SET authToken=$1::json, gitlabUsername=$2::text WHERE csrfToken=$3::text;",
      [tokenDataResponse.data, userDataResponse.data.username, params.state]
    );

    res.redirect(authData.redirecturi);
  } catch (errorMessage) {
    handleError(req, res, errorMessage);
  } finally {
    await client.end();
  }
};
