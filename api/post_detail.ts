import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';
import { formatDate } from '../middleware/date';
import { markdownToHtml } from '../middleware/md_convert';

const router = express.Router();

export type TagProps = {
  id?: string;
  tag_name: string;
};

router.get('/post-detail', async (req, res) => {
  const id = req.query.params as string;
  let sql = `SELECT * FROM articles WHERE id= ?`;
  const posts = (await db.query(sql, id)) as any;
  console.log(posts, 'posts');
  const post = posts.pop(); //DBから取得した配列から記事データを抜き出す
  sql = `SELECT tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id WHERE tagging_articles.articles_id = ?`;
  const tags = (await db.query(sql, id)) as any;
  const arrayTags: TagProps[] = JSON.parse(JSON.stringify(tags));
  arrayTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(post, 'attachedTag') === false) {
      post.attachedTag = [];
    }
    post.attachedTag.push(tag.tag_name);
  });
  post.content = markdownToHtml(post.content);
  post.created_at = formatDate(post.created_at);
  post.updated_at = formatDate(post.updated_at);
  await db.end();
  res.status(200).json(post);
});

export default router;
