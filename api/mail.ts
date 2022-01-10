import express from 'express';
import { createTransport } from 'nodemailer';

const router = express.Router();

/**
 * お問い合わせフォームに入力があった場合にメール通知するためのAPI
 * @body メールの内容
 * @return json ステータスコードのみ
 */
router.post('/mail', async (req, res) => {
  //環境変数から情報を取得して設定
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM, MAIL_TO } = process.env;
  const options = {
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: false,
    requireTLS: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  };
  const { name, email, message } = req.body;
  const body = `ご氏名：${name}
    メールアドレス：${email}
    お問い合わせ内容：${message}`;
  const mail = {
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: 'HPにお問い合わせがありました',
    text: body,
  };

  //nodemailerで送信
  const transporter = createTransport(options);
  try {
    await transporter.sendMail(mail, function (error, info) {
      if (error) {
        console.log('send failed');
        console.log(error.message);
        return;
      }
      console.log('send successful');
      console.log(info.messageId);
      return res.status(200).end();
    });
  } catch (e) {
    console.log('error', e);
    return res.status(500).end();
  }
});

export default router;
