import express from 'express';
import cors from 'cors';
import { verifyToken } from './middleware/auth';

import postsListRouter from './api/posts_list';
import tagsListRouter from './api/tags_list';
import mailRouter from './api/mail';
import postDetailRouter from './api/post_detail';
import postIdsRouter from './api/post_ids';
import sendPostRouter from './api/send_post';
import tagsSelectionRouter from './api/tags_selection';
import deletePostRouter from './api/delete_post';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN,
  })
);

app.use('/images/thumbnail', express.static('public/images/thumbnail/'));

const url = '/api';
app.use(url, verifyToken);
app.use(url, postsListRouter);
app.use(url, tagsListRouter);
app.use(url, mailRouter);
app.use(url, postDetailRouter);
app.use(url, postIdsRouter);
app.use(url, sendPostRouter);
app.use(url, tagsSelectionRouter);
app.use(url, deletePostRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
