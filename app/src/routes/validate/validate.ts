import jwt from "jsonwebtoken";
import fs from "fs";
import { ErrorResponses } from "../../defaultResponses";

export default async (req: any, res: any) => {
  const token = req.get("Authorization")?.match("^Bearer (.*)$")?.[1];
  if (!token) {
    res.status(401).json(ErrorResponses.NoJWT);
    return;
  }
  const pubKey = fs.readFileSync("./jwtRS256.key.pub", { encoding: "utf8" });
  try {
    jwt.verify(token, pubKey, {
      algorithms: ["RS256"],
    });
    res.status(200).end();
  } catch (errorMessage) {
    console.error(errorMessage);
    res.status(401).json(ErrorResponses.NoAuthenticationForSession);
  }
};
