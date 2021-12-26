import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';

const router = express.Router();

router.get('/tags-list', async (req, res) => {
  const sql =
    'SELECT tag_name, COUNT(tags_id) AS count FROM tags LEFT JOIN tagging_articles ON tags.id = tagging_articles.tags_id GROUP BY tags.id';
  const result = (await db.query(sql)) as Array<object>;
  await db.end();
  res.status(200).json(result);
});

export default router;
