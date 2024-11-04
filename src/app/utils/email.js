const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  console.log("test ");
  console.log(options);
  console.log(process.env.EMAIL_HOST);
  console.log(process.env.EMAIL_PORT);
  console.log(process.env.EMAIL_USERNAME);
  console.log(process.env.EMAIL_PASSWORD);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log(options);
  // 2) Define the email options
  const mailOptions = {
    from: "Project Test <test@safwa.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // console.log(mailOptions);
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
  // console.log("mail");
};

module.exports = sendEmail;
