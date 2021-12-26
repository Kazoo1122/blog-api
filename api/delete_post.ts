import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';

const router = express.Router();

router.delete('/delete_post', async (req, res) => {
  const { id } = req.query;
  let sql = 'DELETE FROM articles WHERE id = ?';
  await db.query(sql, id);
  sql = 'DELETE FROM tagging_articles WHERE articles_id = ?';
  await db.query(sql, id);
  await db.end();
  res.status(200).json();
});

export default router;
