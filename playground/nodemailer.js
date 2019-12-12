const nodemailer = require('nodemailer')

const mailer = async () => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mohamed.onbird@gmail.com',
      pass: 'mdp123'
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  let info = await transporter.sendMail({
    from: '"Mohamed Diop" <mohamed.onbird@gmail.com>',
    to:'muhammad.sevn@gmail.com',
    subject: 'Hello',
    text: 'Hello World.'
  })

  console.log(nodemailer.getTestMessageUrl(info))
}

mailer()
  .catch(err => console.log(err))
