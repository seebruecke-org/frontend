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
    const body = err?.response?.body;

    // Log the real cause so production failures are diagnosable.
    console.error('[newsletter/subscribe] Mailchimp error:', body || err);

    // An already-subscribed address is not a real error for the user.
    if (body?.title === 'Member Exists') {
      return res.json({});
    }

    const message =
      process.env.NODE_ENV !== 'production' && body
        ? body
        : { error: 'Something went wrong' };

    return res.status(err?.status || 400).json(message);
  }
}
