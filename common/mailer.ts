import nodemailer from 'nodemailer'


const mailerConfig = 
    nodemailer.createTransport({
        host: process.env.SMTP_HOST ?? 'smtp.ethereal.email',
        port: parseFloat(process.env.SMTP_PORT ?? "587"),
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        },
    
      });


const sendMail = async({emailFrom, email, emailSubject, replacedMjml}: any) => {
    const info = await mailerConfig.sendMail({
              from: emailFrom,
              to: email,
              subject: emailSubject,
              html: replacedMjml,
            });
}

  export  {mailerConfig, sendMail}