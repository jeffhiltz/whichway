var config = require('./config').config;
var nodemailer = require('nodemailer');
var request = require('request');
var scraper = require('./scraper');

var smtpTransport = nodemailer.createTransport("SMTP", config.nmOptions);

function buildBody(routes) {
  var body = '';
  routes.forEach(function (route) {
    body += route.shortDesc + ': ' + route.currentTime + ',  ';
  });
  return body.substring(0, body.length - 3);
}

function sendRoutes(routes, callback) {

  var mailOptions = {
    from: config.email.from,
    to: config.email.recipients.join(", "),
    subject: config.email.subject,
    html: buildBody(routes)
  };

  smtpTransport.sendMail(mailOptions, callback);
}

request(config.url, function handleResponse(err, resp, body) {
  if (err) {
    console.error(err);
  } else {
    var routes = scraper.getRoutes(body);
    sendRoutes(routes, function displayResult(err) {
      if (err) {
        console.error(err);
      } else {
        console.log('Mail sent!');
      }
      process.exit(0);
    });
  }
});
