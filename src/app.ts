import express from "express";
import cors from "cors";
import { verifyToken } from "./middleware/auth";

import postsListRouter from "./api/posts_list";
import tagsListRouter from "./api/tags_list";
import mailRouter from "./api/mail";
import postDetailRouter from "./api/post_detail";
import postIdsRouter from "./api/post_ids";
import sendPostRouter from "./api/send_post";
import tagsSelectionRouter from "./api/tags_selection";
import deletePostRouter from "./api/delete_post";

const app = express();
const port = process.env.SERVER_PORT;

//記事投稿のため容量制限を50mbへ設定
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//CORSの許可
const allowCsv = process.env.ALLOW_ORIGIN as string;
const allowList = allowCsv.split(',');
const options: cors.CorsOptions = {
  origin: allowList,
};
app.use(cors(options));

app.use(express.static(process.cwd() + '/public'));

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

export default app;
