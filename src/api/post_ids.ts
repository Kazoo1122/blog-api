import express from "express";
import { db } from "../middleware/mysql";
import "express-async-errors";

const router = express.Router();

/**
 * 記事のID一覧を取得するAPI
 * @return json 記事のIDリスト
 */
router.get('/post-ids', async (req, res) => {
  const sql = 'SELECT id FROM articles';
  const ids = (await db.query(sql)) as Array<object>;
  await db.end();
  res.status(200).json(ids);
});

export default router;
