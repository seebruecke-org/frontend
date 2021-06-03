import { serializeError } from 'serialize-error';
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export default async function handler(req, res) {
  try {
    if (!req?.query || Object.keys(req.query).length === 0) {
      throw new Error('Invalid request');
    }

    const { subject, body } = req.query;

    if (!subject || !body) {
      throw new Error('Subject and body must be provided');
    }

    await transporter.sendMail({
      from: process.env.NOTIFY_SENDER,
      to: process.env.NOTIFY_RECEIVERS,
      subject: decodeURIComponent(subject),
      text: decodeURIComponent(body)
    });

    res.send({});
  } catch (error) {
    res
      .status(500)
      .send(
        process.env.NODE_ENV !== 'production'
          ? JSON.stringify(serializeError(error))
          : ''
      );
  }
}
