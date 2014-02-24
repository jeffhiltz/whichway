var config = require('./config').config;
var CronJob = require('cron').CronJob;
var Mailer = require('./mailer').Mailer;
var request = require('request');
var scraper = require('./scraper');

var mailer = new Mailer(config.nmOptions);

var jobs = [];

// Returns a boolean indicating if the default route is the fastest route.
function defaultFastest(trip, routes) {
  return trip.defaultRoute === routes[0].description ||
    trip.defaultRoute === routes[0].shortDesc;
}

function processTrip(trip) {
  console.log('Processing ' + trip.name + '...');
  request(trip.url, function handleResponse(err, resp, body) {
    if (err) {
      console.error('Failed to get URL for %s: ', trip.name, err);
    } else {
      var routes = scraper.getRoutes(body);
      if (defaultFastest(trip, routes)) {
        console.log('Default route is fastest for %s', trip.name);
      } else {
        mailer.sendRoutes(trip.email, routes, function displayResult(err) {
          if (err) {
            console.error('Failed to get routes for %s: ', trip.name, err);
          } else {
            console.log('Mail sent for %s', trip.name);
          }
        });
      }
    }
  });
}

config.trips.forEach(function (trip, index) {
  try {
    console.log('Adding trip - %s', trip.name);
    jobs[index] = new CronJob(trip.schedule, function () {
      processTrip(trip);
    }, null, true);
  } catch (ex) {
    console.error('Invalid schedule: "%s" (%s)', trip.schedule, trip.name);
  }
});
