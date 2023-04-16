// import sendInBlue from 'sib-api-v3-sdk';

// sendInBlue.ApiClient.instance.authentications['api-key'].apiKey =
//   process.env.SIB_KEY;

const sendEmail = async ({ email, subject, htmlContent }) => {
  // try {
  //   const emailApi = new sendInBlue.TransactionalEmailsApi();
  //   await emailApi.sendTransacEmail({
  //     sender: { email: 'maabaa@gmail.com', name: 'nodeshop' },
  //     subject,
  //     htmlContent,
  //     to: [{ email }],
  //   });
  // } catch (error) {
  //   next(new Error(error));
  // }
  console.error('Reminder: Mailer is disabled.');
};

export const sendWelcomeEmail = (email) => {
  sendEmail({
    email,
    subject: 'Signup successful.',
    htmlContent: `<!DOCTYPE html>
    <html>
      <body>
        <h1>Welcome to nodeshop!</h1>
        <p>The mailer works. ☺️</p>
      </body>
    </html>`,
  });
};

export const sendResetPasswordEmail = async (email, token) => {
  sendEmail({
    email,
    subject: 'Reset your password.',
    htmlContent: `<!DOCTYPE html>
    <html>
      <body>
        <h1>Reset your password.</h1>
        <a href="http://localhost:3000/reset/${token}">Click here to reset your password.</a>
      </body>
    </html>`,
  });
};

export const sendNewPasswordEmail = (email) => {
  sendEmail({
    email,
    subject: 'Your password has been reset.',
    htmlContent: `<!DOCTYPE html>
    <html>
      <body>
        <h1>Your password has been reset.</h1>
        <p>Your password has been reset successfully.</p>
      </body>
    </html>`,
  });
};
