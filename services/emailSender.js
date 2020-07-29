const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PWD
  }
});

module.exports = {
    sendRegistrationEmail(email, username){
        const mailOptions = {
            from: process.env.GMAIL_ADDRESS,
            to: email,
            subject: 'Account created',
            text: `Your account ${username} has been created ! You can now login and use the app`
          };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}