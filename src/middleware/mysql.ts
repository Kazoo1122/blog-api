import mysql from "serverless-mysql";
import "dotenv/config";

/**
 * mysqlを利用するための設定を読み込む
 */
export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});
