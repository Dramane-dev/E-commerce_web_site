const nodemailer = require("nodemailer");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "devtestbackend@gmail.com",
      pass: "IuhsV_P20"
    }
  });

  const mailOptions = {
    from: "mail",
    to: "mail",
    subject: "Une vente !",
    text: `
      Prix: ${data.amount / 100}€
      token: ${data.token}
      nom: ${data.name}
      email: ${data.email}
      Adresse: ${data.address_line1}
      Ville: ${data.address_city}
      Code postal: ${data.address_zip}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error);
    } else {
      callback(null, {
        statusCode: 200,
        body: "Ok"
      });
    }
  });
};

