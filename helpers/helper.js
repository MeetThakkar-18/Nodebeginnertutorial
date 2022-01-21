const nodemailer = require('nodemailer');
// function for sending mail using node mailer

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.AUTH_EMAIL, // sender address
      to: email, // list of receivers
      subject: 'Forgot Password', // Subject line
      text: `Your one time password`, // plain text body
      html: `<p><b>your one time password is : ${otp} </b> Enter this otp in the swagger reset password section and also enter your new password and click submit then your password will be successfully reseted<p>This otp will get expire in 2 mins</p></p>`, // html body
    });
    return info.messageId;
  } catch (error) {
    return error.message;
  }
};

// generating alphanumeric otp

const getOtp = function () {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += process.env.RANDOM_CHARS.charAt(Math.floor(Math.random() * process.env.RANDOM_CHARS.length));
  }
  return result;
};

module.exports = { sendEmail, getOtp };
