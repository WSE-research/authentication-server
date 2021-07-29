import { Client } from "pg";
import { ErrorResponses } from "../../defaultResponses";
import handleError from "../../helpers/handleError";

const pkceChallenge = require("pkce-challenge");


export default async (req: any, res: any) => {
  const params = req.query;
  if (!params.state || !params.scope || !params.redirect_uri) {
    res.status(400).json(ErrorResponses.NoStateScopeRedirectURI);
    return;
  }
  const { code_challenge, code_verifier } = pkceChallenge();

  const client = new Client();

  try {
    await client.connect();

    await client.query(
    "INSERT INTO auth_data (csrfToken, codeChallenge, codeVerifier, redirectURI) VALUES($1::text, $2::text, $3::text, $4::text) ON CONFLICT (csrfToken) DO UPDATE SET codeChallenge=$2::text, codeVerifier=$3::text, redirectURI=$4::text;",
    [
      params.state,
      code_challenge,
      code_verifier,
      params.redirect_uri,
    ]
  );

  const redirect_uri = `https://${req.get("host")}/generateToken`;

  res.redirect(
    process.env["GITLAB_AUTHORIZE_URL"] +
      `?client_id=${process.env.GITLAB_APP_ID}` +
      `&redirect_uri=${redirect_uri}` +
      `&response_type=code` +
      `&state=${params.state}` +
      `&scope=${params.scope}` +
      `&code_challenge=${code_challenge}` +
      `&code_challenge_method=S256`
  );
    } catch (errorMessage) {
    handleError(req, res, errorMessage);
  } finally {
    await client.end();
  }
};
