var nodemailer = require('nodemailer');

var Mailer = function (options) {
  this.smtpTransport = nodemailer.createTransport("SMTP", options);
};

function buildBody(routes) {
  var body = '';
  routes.forEach(function (route) {
    body += route.shortDesc + ': ' + route.currentTime + ',  ';
  });
  return body.substring(0, body.length - 3);
}

Mailer.prototype.sendRoutes = function (options, routes, callback) {

  var mailOptions = {
    from: options.from,
    to: options.recipients.join(", "),
    subject: options.subject,
    html: buildBody(routes)
  };

  this.smtpTransport.sendMail(mailOptions, callback);
};

exports.Mailer = Mailer;