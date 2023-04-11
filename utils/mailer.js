import sendInBlue from 'sib-api-v3-sdk';

import { logError } from './logError.js';

sendInBlue.ApiClient.instance.authentications['api-key'].apiKey =
  process.env.SIB_KEY;

export const sendEmail = async (email) => {
  try {
    const emailApi = new sendInBlue.TransactionalEmailsApi();
    await emailApi.sendTransacEmail({
      sender: { email: 'maabaa@gmail.com', name: 'Pefington' },
      subject: 'Signup successful.',
      htmlContent:
        '<!DOCTYPE html><html><body><h1>Welcome to nodeshop!</h1><p>The mailer works. ☺️</p></body></html>',
      to: [{ email }],
    });
  } catch (error) {
    logError(error);
  }
};
