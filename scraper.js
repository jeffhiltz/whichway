var cheerio = require('cheerio');
var config = require('./config').config;

function dummy() {
  console.log('dummy');
}

function getSeconds(str) {
  if (!str.match(/\d+\s*[hm]/)) {
    return NaN;
  }

  var seconds = 0;
  var hours = str.match(/(\d+)\s*h/);
  var minutes = str.match(/(\d+)\s*m/);
  if (hours) {
    seconds += parseInt(hours[1], 10) * 3600;
  }
  if (minutes) {
    seconds += parseInt(minutes[1], 10) * 60;
  }
  return seconds;
}

function compareCurrTime(routeA, routeB) {
  var secondsA = getSeconds(routeA.currentTime);
  var secondsB = getSeconds(routeB.currentTime);
  var result;

  if (secondsA === secondsB || (isNaN(secondsA) && isNaN(secondsB))) {
    result = 0;
  } else if (secondsA < secondsB || isNaN(secondsB)) {
    result = -1;
  } else { //if (secondsA > secondsB || isNaN(secondsA)) {
    result = 1;
  }

  return result;
}

//TODO handle routes that don't have "currentTime" info
function scrapeRoutes(body) {
  var routes = [];
  var $ = cheerio.load(body);

  //.dir-altroute-inner is the <div> wrapping each route
  $('.dir-altroute-inner').each(function (index, element) {
    var route = {};

    $(element).children().each(function (index, element) {

      if ($(element).hasClass('altroute-info')) {
        var spans = $(element).find('span').toArray();
        route.distance = $(spans[0]).text();
        route.time= $(spans[1]).text();
      } else if ($(element).hasClass('altroute-aux')) {
        route.currentTime = $(element).find('.altroute-aux span')
          .eq(0)
          .text()
          .trim();
      } else if (!$(element).hasClass('dir-altroute-clear')) {
        route.description = $(element).text();
      }

    });

    routes.push(route);
  });

  return routes;
}

function parseRoute(route) {
  var parsedRoute = {};

  var currTime = route.currentTime.match(/([0-9]+ hours? )?[0-9]+ mins?/);
  parsedRoute.currentTime = currTime
    ? currTime[0]
    : 'Unknown';
  parsedRoute.distance = route.distance;
  parsedRoute.time = route.time;
  parsedRoute.description = route.description;
  parsedRoute.shortDesc = config.shortNames[route.description] || route.description;

  return parsedRoute;
}

function getRoutes(body) {
  var routes = [];
  var rawRoutes = scrapeRoutes(body);
  rawRoutes.forEach(function (route) {
    routes.push(parseRoute(route));
  });
  return routes.sort(compareCurrTime);
}


exports.scrapeRoutes = scrapeRoutes;
exports.parseRoute = parseRoute;
exports.getRoutes = getRoutes;
exports.compareCurrTime = compareCurrTime;