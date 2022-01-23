import express from "express";
import { db } from "../middleware/mysql";
import "express-async-errors";

const router = express.Router();

/**
 * 記事にどのタグを添付するか選択するためのタグリストを取得するAPI
 * @return json タグリスト
 */
router.get('/tags-selection', async (req, res) => {
  const sql = 'SELECT id, tag_name FROM tags ORDER BY id ASC';
  const result = (await db.query(sql)) as Array<object>;
  await db.end();
  res.status(200).json(result);
});

export default router;
