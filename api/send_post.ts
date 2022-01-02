import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';
import path from 'path';
import { OkPacket } from 'mysql';
import fs from 'fs';
import { TagProps } from './post_detail';
import { Buffer } from 'buffer';

const router = express.Router();

router.post('/send-post', async (req, res) => {
  const { type, id } = req.query;
  const THUMBNAIL_IMG_DIR_PATH = '/public/images/thumbnail/';
  const THUMBNAIL_IMG_DIR_FULL_PATH = path.join(process.cwd(), THUMBNAIL_IMG_DIR_PATH);
  const data = req.body;
  const { title, tags, content, thumbnail_name, thumbnail_data } = data;
  if (!thumbnail_name) {
    const imgPath = path.join(THUMBNAIL_IMG_DIR_FULL_PATH, thumbnail_name);
    const buffer = Buffer.from(thumbnail_data, 'base64');
    fs.writeFile(imgPath, buffer, (err) => {
      if (!err) {
        console.log('Writing completed.');
      } else {
        console.log('Writing is failed.' + err);
        throw err;
      }
    });
  }

  let sql, values;
  if (type === 'NEW') {
    sql =
      'INSERT INTO articles(title, content, thumbnail, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW())';
    values = [title, content, thumbnail_name];
  } else {
    sql = 'UPDATE articles SET title=?';
    values = [title];
    if (content) {
      sql += ', content=?';
      values.push(content);
    }
    const { is_null_thumbnail } = data;
    if (is_null_thumbnail) {
      sql += ', thumbnail=NULL';
    } else if (thumbnail_data) {
      sql += ', thumbnail=?';
      values.push(thumbnail_name);
    }
    sql += ', updated_at=NOW() WHERE id=?';
    values.push(id);
  }
  try {
    const articleResult: OkPacket = await db.query(sql, values);
    console.log(sql, 'sql');
    console.log(articleResult, 'articleResult');
    const articles_id = type === 'NEW' ? articleResult.insertId : id;
    if (type === 'EDIT') {
      sql = 'DELETE FROM tagging_articles WHERE articles_id = ?';
      const tagDeleteResult = await db.query(sql, id);
      console.log(tagDeleteResult, 'deleteResult');
    }
    const tagsResult: OkPacket[] = [];
    await tags.map(async (tag: TagProps) => {
      sql = 'INSERT INTO tagging_articles(articles_id, tags_id) VALUES(?, ?)';
      values = [articles_id, tag.id];
      const result: OkPacket = await db.query(sql, values);
      tagsResult.push(result);
    });
    console.log('tags result is:', tagsResult);
    res.status(201).json({ ...data, id: articles_id });
  } catch (err) {
    console.log(err, 'databases error.');
  } finally {
    await db.end();
  }
});

export default router;
