import express from 'express';
import { db } from '../middleware/mysql';
import 'express-async-errors';

const router = express.Router();

router.get('/tags-selection', async (req, res) => {
  const sql = 'SELECT id, tag_name FROM tags ORDER BY id ASC';
  const result = (await db.query(sql)) as Array<object>;
  await db.end();
  console.log(result);
  res.status(200).json(result);
});

export default router;
