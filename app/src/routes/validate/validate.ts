import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";

export default async (req: any, res: any) => {
  const token = req.get("Authorization")?.match("^Bearer (.*)$")?.[1];
  const pubKey = fs.readFileSync("./jwtRS256.key.pub", { encoding: "utf8" });
  try {
    const data = JSON.parse(
      JSON.stringify(
        jwt.verify(token, pubKey, {
          algorithms: ["RS256"],
        })
      )
    );
    res.status(200).json(data);
  } catch (errorMessage) {
    console.error(errorMessage);
    res.status(401).json({});
  }
};
