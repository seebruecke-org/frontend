import mailchimp from '@mailchimp/mailchimp_marketing';

const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_LIST_ID } = process.env;

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(400)
      .json({ error: 'Only POST is allowed as request method.' });
  }

  if (!req?.body?.email) {
    return res.status(400).json({ error: 'You must submit an email address.' });
  }

  try {
    await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, {
      email_address: req.body.email,
      status: 'pending'
    });

    return res.json({});
  } catch (err) {
    let message = {
      error: 'Something went wrong'
    };

    if (process.env.NODE_ENV !== 'production') {
      message = err.response.body;
    }

    return res.status(err.status || 400).json(message);
  }
}
