const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config(); //load environment variables from a .env file into process.env.

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //extracting token from authHeader at array index 1.
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, userPayLoad: any) => {
      if (err) {
        return res.sendStatus(403); // '403 forbidden—you don't have permission to access this resource'.
      }
      req.user = userPayLoad;
      next();
    }
  );
}
module.exports = verifyToken;
