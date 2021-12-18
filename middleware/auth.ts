import { verify, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  let secretKey = process.env.JWT_SECRET_KEY as string;
  secretKey = secretKey.replace(/\\n/g, '\n');
  const token = req.headers.authorization;

  //authorizationキーがない場合
  if (!token) {
    res.status(401).json({ message: 'Authentication failed.' });
    return;
  }

  await verify(token, secretKey, (err: VerifyErrors | null, decoded: object | undefined) => {
    if (err === null && decoded !== undefined) {
      console.log('verified!');
      next();
    } else {
      res.status(401).json({ message: 'Authentication failed.' });
      return;
    }
  });
};
