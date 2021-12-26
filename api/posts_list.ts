import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';
import path from 'path';
import { formatDate, sortWithDate } from '../middleware/date';
import { markdownToPlain } from '../middleware/md_convert';

const router = express.Router();

type LinkingTag = {
  tag_name: string;
  articles_id: string;
};

type PostProps = {
  id?: string;
  title: string;
  content: string;
  thumbnail: string;
  created_at: Date;
  updated_at: Date;
  attachedTag: Array<string>;
};

router.get('/posts-list', async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const tag = req.query.tag;
  let sql =
    tag === undefined
      ? limit === 0
        ? 'SELECT * FROM articles ORDER BY id DESC'
        : 'SELECT * FROM articles ORDER BY id DESC LIMIT ?, ?'
      : `SELECT a.id, a.title, a.content, a.thumbnail, a.created_at, a.updated_at
      FROM articles AS a
      LEFT JOIN tagging_articles AS ta ON a.id = ta.articles_id
      LEFT JOIN tags AS t ON ta.tags_id = t.id
      WHERE t.tag_name = '${tag}'
      ORDER BY id DESC LIMIT ?, ?`;
  const posts = (await db.query(sql, [offset, limit])) as any;
  if (!posts.length) return res.status(204).json();
  const ids = posts.map((post: PostProps) => {
    return post.id;
  });
  sql = `SELECT articles_id, tag_name 
    FROM tagging_articles 
    INNER JOIN tags ON tagging_articles.tags_id = tags.id 
    WHERE articles_id IN(?)`;
  const tags = (await db.query(sql, [ids])) as any;
  tags.forEach((tag: LinkingTag) => {
    const taggedPost = posts.find((post: PostProps) => tag.articles_id === post.id);
    if (Object.prototype.hasOwnProperty.call(taggedPost, 'attachedTag') === false) {
      taggedPost.attachedTag = [];
    }
    taggedPost.attachedTag.push(tag.tag_name);
  });
  const sortedPosts = posts.sort(sortWithDate('created_at', true));
  const THUMBNAIL_IMG_DIR_PATH = '/images/thumbnail/';
  const NO_IMG_PATH = path.join(THUMBNAIL_IMG_DIR_PATH, 'no_image.png');
  //各記事の日付と内容を整形
  const result = sortedPosts.map((item: PostProps) => {
    return {
      id: item.id,
      title: item.title,
      content: markdownToPlain(item.content),
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
      thumbnail:
        item.thumbnail !== null ? path.join(THUMBNAIL_IMG_DIR_PATH, item.thumbnail) : NO_IMG_PATH,
      attachedTag: Object.prototype.hasOwnProperty.call(item, 'attachedTag')
        ? item.attachedTag
        : [],
    };
  });
  await db.end();
  res.status(200).json(result);
});

export default router;
