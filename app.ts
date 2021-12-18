import express from 'express';
import cors from 'cors';
import { verifyToken } from './middleware/auth';

import articlesRouter from './api/articles';
import mailRouter from './api/mail';

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(verifyToken);

app.use('/articles', articlesRouter);
app.use('/mail', mailRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
