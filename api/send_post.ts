import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';
import path from 'path';
import { OkPacket } from 'mysql';
import fs from 'fs';
import { TagProps } from './post_detail';
import { Buffer } from 'buffer';

const router = express.Router();

/**
 * 記事投稿用のAPI
 * @param string type 新規投稿(NEW)か編集(EDIT)か
 * @param string id 編集時の記事ID
 * @param object body 記事内容
 * @return json 投稿データおよび新規投稿・編集した記事ID
 */
router.post('/send-post', async (req, res) => {
  const { type, id } = req.query;
  const THUMBNAIL_IMG_DIR_PATH = '/public/images/thumbnail/';
  const THUMBNAIL_IMG_DIR_FULL_PATH = path.join(process.cwd(), THUMBNAIL_IMG_DIR_PATH);
  const data = req.body;
  const { title, tags, content, thumbnail_name, thumbnail_data } = data;

  console.log(thumbnail_name, 'thumbnail_name');
  console.log(thumbnail_name === null);
  //記事サムネイルの送信があればファイル保存
  if (thumbnail_name !== null) {
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
  //新規の場合はそのままDBに格納
  if (type === 'NEW') {
    sql =
      'INSERT INTO articles(title, content, thumbnail, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW())';
    values = [title, content, thumbnail_name];
    //編集の場合は更新箇所に応じてsqlを追記
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
    const articles_id = type === 'NEW' ? articleResult.insertId : id;
    //編集の場合は一度添付タグをクリアしてから付け直す
    if (type === 'EDIT') {
      sql = 'DELETE FROM tagging_articles WHERE articles_id = ?';
      const tagDeleteResult = await db.query(sql, id);
      console.log(tagDeleteResult, 'deleteResult');
    }
    //記事とタグの中間テーブル(tagging_articles)に記録
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
    res.status(500).json('databases error.');
    console.log(err);
  } finally {
    await db.end();
  }
});

export default router;
