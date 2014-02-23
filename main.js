var config = require('./config').config;
var Mailer = require('./mailer').Mailer;
var request = require('request');
var scraper = require('./scraper');

var mailer = new Mailer(config.nmOptions);

request(config.url, function handleResponse(err, resp, body) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    var routes = scraper.getRoutes(body);
    mailer.sendRoutes(config.email, routes, function displayResult(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      } else {
        console.log('Mail sent!');
        process.exit(0);
      }
    });
  }
});
