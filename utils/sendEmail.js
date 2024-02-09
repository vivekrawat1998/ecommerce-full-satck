const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create a transporter

  //right now we are using ethereal email for the testing purpose and in etheral email it will generate a email and the password which is only for the testing purpose//
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: "vr90888561@gmail.com",
        pass: 'kmnrieemmwvtjpqx'
    }
});

  // Define mail options
  //
  const mailOptions = {
    from: "vr90888561@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);

  // Log the preview URL for testing
  console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
