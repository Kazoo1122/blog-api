# blog-api

## 概要
- [nextjs-blog](https://github.com/Kazoo1122/nextjs-blog)で作成したブログ記事を管理するAPIです。
- expressをベースに、DBにMySQL、リバースプロキシにnginxを使用しています。

## デモ(このAPIを使用しているブログサイト)
- [レジ打ちからエンジニアになりました 〜中途エンジニアの開発日誌〜](https://dev-learning.net/)

## 使用ライブラリ  
- `express` `debug` `http-errors` `morgan`: `express-generator`で生成。  
- `express-async-errors`: 非同期通信時の例外をキャッチするために使用。  
- `jsonwebtoken` : API呼び出し時の認証に使用。  
- `dotenv`: 環境変数の読み込み。   
- `markdown-it` `markdown-it-plain-text`: マークダウン形式で記述した記事の変換。  
- `nodemailer`: お問い合わせフォームの内容を送信する際に使用。
- `serverless-mysql`: MySQL接続用。  
- `cors`: CORS対策。  

## 作者
Kazoo1122  
Email: [kazoo1122@experience.work](kazoo1122@experience.work)
