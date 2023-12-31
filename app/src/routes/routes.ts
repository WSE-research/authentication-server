import getToken from "./getToken/getToken";
import generateToken from "./generateToken/generateToken";
import authenticate from "./authenticate/authenticate";
import validate from "./validate/validate";

module.exports = function (app: any, privKey: string) {
  app.get("/authenticate", authenticate);
  app.get("/getToken", (req: any, res: any) => getToken(req, res, privKey));
  app.get("/generateToken", generateToken);
  app.get("/validate", validate);
};
