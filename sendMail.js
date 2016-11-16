const nodemailer = require('nodemailer');

require('dotenv').config();

var send = function(content) {
  // create reusable transporter object using the default SMTP transport
  // var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
  const transporter = nodemailer.createTransport(process.env.SMTP_GMAIL);

  // setup e-mail data with unicode symbols
  var mailOptions = {
      to: process.env.EMAIL, // list of receivers
      subject: "Found Your Item", // Subject line
      text:  JSON.stringify(content)// html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      var d = new Date();
      console.log(d.toISOString() + ' Message sent: ' + info.response);
  });
};

exports.send = send;
