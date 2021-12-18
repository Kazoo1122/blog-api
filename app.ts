import express from 'express';
import cors from 'cors';
import { verifyToken } from './middleware/auth';

import articlesRouter from './api/articles';
import mailRouter from './api/mail';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN,
  })
);
app.use(verifyToken);
app.use('/api/articles', articlesRouter);
app.use('/api/mail', mailRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
