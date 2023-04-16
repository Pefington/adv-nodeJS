import nodemailer from 'nodemailer';
import Transport from 'nodemailer-sendinblue-transport';

const transporter = nodemailer.createTransport(
  new Transport({
    apiKey: process.env.SIB_KEY,
  })
);

const sendEmail = async ({ email, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: '"nodeshop" <maabaa@gmail.com>',
      to: email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(error);
  }
  // console.error('Reminder: Mailer is disabled.');
};

export const sendWelcomeEmail = (email) => {
  sendEmail({
    email,
    subject: 'Signup successful.',
    text: 'Welcome to nodeshop!',
    html: `<!DOCTYPE html>
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
    text: `Reset your password by going to: http://localhost:3000/reset/${token}`,
    html: `<!DOCTYPE html>
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
    text: 'Your password has been reset successfully.',
    html: `<!DOCTYPE html>
    <html>
      <body>
        <h1>Your password has been reset.</h1>
        <p>Your password has been reset successfully.</p>
      </body>
    </html>`,
  });
};
