import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';
import path from 'path';
import { formatDate, sortWithDate } from '../middleware/date';
import { markdownToPlain } from '../middleware/md_convert';

const router = express.Router();

const DATABASE_QUERY = {
  ARTICLES: 0,
  TAGS_FOR_ARTICLES: 1,
  ONE_ARTICLE: 2,
  TAGS_FOR_ONE_ARTICLE: 3,
  ALL_TAGS_ID_AND_NAME: 4,
  ALL_TAGS: 5,
  ALL_ARTICLES_ID: 6,
};

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

router.get('/', async (req, res) => {
  const query = req.query.query;
  const params = req.query.params as string[];
  let sql = '';
  switch (Number(query)) {
    case DATABASE_QUERY.ARTICLES:
      const offset = Number(params[0]);
      const limit = Number(params[1]);
      sql = 'SELECT * FROM articles ORDER BY id desc LIMIT ?, ?';
      const posts = (await db.query(sql, [offset, limit])) as any;
      const start = posts[0].id;
      const end = posts[limit - 1].id;
      sql =
        'SELECT articles_id, tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id WHERE articles_id BETWEEN ? AND ?';
      const tags = (await db.query(sql, [start, end])) as any;
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
            item.thumbnail !== null
              ? path.join(THUMBNAIL_IMG_DIR_PATH, item.thumbnail)
              : NO_IMG_PATH,
          attachedTag: Object.prototype.hasOwnProperty.call(item, 'attachedTag')
            ? item.attachedTag
            : [],
        };
      });
      return res.status(200).json(result);
      break;
    case DATABASE_QUERY.TAGS_FOR_ARTICLES:
      sql = `SELECT articles_id, tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id WHERE articles_id BETWEEN ${params[1]} AND ${params[0]};`;
      break;
    case DATABASE_QUERY.ONE_ARTICLE:
      sql = `SELECT * FROM articles WHERE id=${params[0]}`;
      break;
    case DATABASE_QUERY.TAGS_FOR_ONE_ARTICLE:
      sql = `SELECT tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id WHERE tagging_articles.articles_id=${params[0]};`;
      break;
    case DATABASE_QUERY.ALL_TAGS_ID_AND_NAME:
      sql = 'SELECT id, tag_name FROM tags';
      break;
    case DATABASE_QUERY.ALL_TAGS:
      sql = 'SELECT tag_name FROM tags';
      break;
    case DATABASE_QUERY.ALL_ARTICLES_ID:
      sql = 'SELECT id FROM articles';
      break;
    default:
      throw new Error('The given query is incorrect.');
  }
  console.log(sql, 'sql');
  const result = (await db.query(sql)) as Array<object>;
  await db.end();
  console.log(result);
  res.status(200).json(result);
});

export default router;
