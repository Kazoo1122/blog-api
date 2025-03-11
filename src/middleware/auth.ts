import { verify, VerifyErrors } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import fs from "fs";

/**
 * JWT認証を行うミドルウェア
 * @param req
 * @param res
 * @param next
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const publicKeyPath = process.env.PUBLIC_KEY_PATH as string;
  const publicKeyContent = fs.readFileSync(publicKeyPath).toString();
  const token = req.headers.authorization;

  //authorizationキーがない場合
  if (!token) {
    console.log('The existence of the token could not be confirmed.');
    return res.status(401).json({ message: 'Authentication failed.' });
  }

  verify(token, publicKeyContent, (err: VerifyErrors | null, decoded: object | undefined) => {
    if (err === null && decoded !== undefined) {
      console.log('verified!');
      next();
    } else {
      console.log('Failed to authenticate the token.');
      return res.status(401).json({ message: 'Authentication failed.' });
    }
  });
};
