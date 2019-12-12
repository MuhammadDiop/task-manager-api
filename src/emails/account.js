const nodemailer = require('nodemailer')

const sendWelcomeEmail = async (email, name) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mohamed.bigblue@gmail.com',
      pass: process.env.MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  let info = await transporter.sendMail({
    from: '"Mohamed Diop" <mohamed.onbird@gmail.com>',
    to: email,
    subject: 'Thanks for joining in!',
    text: 'Welcome to the app, ' + name + '. Let me know how you get along with the app.'
  })

  console.log(nodemailer.getTestMessageUrl(info))
}

const sendCancelEmail = async (email, name) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mohamed.bigblue@gmail.com',
      pass: 'Actionboy13'
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  let info = await transporter.sendMail({
    from: '"Mohamed Diop" <mohamed.onbird@gmail.com>',
    to: email,
    subject: 'Why did you leave us!',
    text: 'Goodbye ' + name + ', can you tell us what was the reason ? It would really help us.'
  })

  console.log(nodemailer.getTestMessageUrl(info))
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
