import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

/**
 * Allows to ckeck password
 * @param password
 * @param passHas
 * @returns
 */
const verifyPassword = async (password: string, passHas: string) => {
  return await argon2.verify(passHas, password);
};

/**
 *
 * @param payload
 * @returns
 */
const signJwt = (payload: any) => {
  // if not decode key jwt
  if (process.env.JWT_SECRET_KEY === undefined) {
    throw new Error();
  }
  //  For expire the token jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: 60 * 60,}
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

/**
 * Allows to ckeck token, return the token payload if decode key jwt
 * @param token
 * @returns
 */
const verifyToken = (token: string) => {
  // if not decode key jwt send error
  if (process.env.JWT_SECRET_KEY === undefined) {
    throw new Error();
  }
  // return send the payload and verify the token else send error
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export default {
  verifyPassword,
  signJwt,
  verifyToken,
};
