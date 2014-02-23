var config = require('./config').config;
var CronJob = require('cron').CronJob;
var Mailer = require('./mailer').Mailer;
var request = require('request');
var scraper = require('./scraper');

var mailer = new Mailer(config.nmOptions);

var jobs = [];

function processTrip(trip) {
  console.log('Processing ' + trip.name + '...');
  request(trip.url, function handleResponse(err, resp, body) {
    if (err) {
      console.error('Failed to get URL for ' + trip.name);
      console.error(err);
    } else {
      var routes = scraper.getRoutes(body);
      mailer.sendRoutes(trip.email, routes, function displayResult(err) {
        if (err) {
          console.error('Failed to get routes for ' + trip.name);
          console.error(err);
        } else {
          console.log('Mail sent for ' + trip.name);
        }
      });
    }
  });
}

config.trips.forEach(function (trip, index) {
  try {
    console.log('Adding trip - ' + trip.name);
    jobs[index] = new CronJob(trip.schedule, function () {
      processTrip(trip);
    }, null, true);
  } catch (ex) {
    console.error('cron pattern not valid');
  }
});
