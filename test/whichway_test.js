/*global describe, after, it, before, beforeEach, afterEach*/

var assert = require('assert');
var config = require('../config').config;
var should = require('should');
var util = require('util');
var whichway = require('../whichway.js');

// Relevent portion of the page being scraped.
var testData = '<ol class="dir-altroute-mult dir-mrgn" oi="alts_3" id="dir_altroutes_body"> <li class="dir-altroute altroute-current" id="altroute_0" altid="0" oi="alt_0" jsaction="ar.select;mouseover:ar.mouseOver;mouseout:ar.mouseOut"> <div class="dir-altroute-inner">  <div class="altroute-rcol altroute-info">  <span>15.7 km</span>, <span>14 mins</span>    </div> <div class="altroute-rcol altroute-aux"> <img src="//maps.gstatic.com/mapfiles/transparent.png" class="dir-traffic dir-traffic-green"> <span> In current traffic: 15 mins </span>  </div> <div>Trans-Canada Hwy</div>    <div class="dir-altroute-clear"></div> </div> </li><li class="dir-altroute" id="altroute_1" altid="1" oi="alt_1" jsaction="ar.select;mouseover:ar.mouseOver;mouseout:ar.mouseOut"> <div class="dir-altroute-inner">  <div class="altroute-rcol altroute-info">  <span>11.9 km</span>, <span>16 mins</span>    </div> <div class="altroute-rcol altroute-aux"> <img src="//maps.gstatic.com/mapfiles/transparent.png" class="dir-traffic dir-traffic-gray">  <span> No traffic information </span> </div> <div>Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W</div>    <div class="dir-altroute-clear"></div> </div> </li><li class="dir-altroute" id="altroute_2" altid="2" oi="alt_2" jsaction="ar.select;mouseover:ar.mouseOver;mouseout:ar.mouseOut"> <div class="dir-altroute-inner">  <div class="altroute-rcol altroute-info">  <span>15.7 km</span>, <span>15 mins</span>    </div> <div class="altroute-rcol altroute-aux"> <img src="//maps.gstatic.com/mapfiles/transparent.png" class="dir-traffic dir-traffic-green"> <span> In current traffic: 1 hour 16 mins </span>  </div> <div>Bogus Route Description</div>    <div class="dir-altroute-clear"></div> </div> </li> </ol>';
// Route data from the above section of HTML
var rawRoutes = [
  { distance: '15.7 km',
    time: '14 mins',
    currentTime: 'In current traffic: 15 mins',
    description: 'Trans-Canada Hwy' },
  { distance: '11.9 km',
    time: '16 mins',
    currentTime: 'No traffic information',
    description: 'Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W' },
  { distance: '15.7 km',
    time: '15 mins',
    currentTime: 'In current traffic: 1 hour 16 mins',
    description: 'Bogus Route Description' }
];
var parsedRoutes = [
  { distance: '15.7 km',
    time: '14 mins',
    currentTime: '15 mins',
    description: 'Trans-Canada Hwy',
    shortDesc: config.shortNames['Trans-Canada Hwy'] },
  { distance: '11.9 km',
    time: '16 mins',
    currentTime: 'Unknown',
    description: 'Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W',
    shortDesc: config.shortNames['Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W'] },
  { distance: '15.7 km',
    time: '15 mins',
    currentTime: '1 hour 16 mins',
    description: 'Bogus Route Description',
    shortDesc: 'Bogus Route Description' }
];
var sortedRoutes = [
  { distance: '15.7 km',
    time: '14 mins',
    currentTime: '15 mins',
    description: 'Trans-Canada Hwy',
    shortDesc: config.shortNames['Trans-Canada Hwy'] },
  { distance: '15.7 km',
    time: '15 mins',
    currentTime: '1 hour 16 mins',
    description: 'Bogus Route Description',
    shortDesc: 'Bogus Route Description' },
  { distance: '11.9 km',
    time: '16 mins',
    currentTime: 'Unknown',
    description: 'Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W',
    shortDesc: config.shortNames['Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W'] }
];

describe('whichway', function () {
  describe('#scrapeRoutes', function () {

    it('should return an array with 3 routes', function () {
      var routes = whichway.scrapeRoutes(testData);
      assert(util.isArray(routes), 'scrapeRoutes should return an array');
      assert.equal(routes.length, 3, 'scrapeRoutes should return the 3 routes');
    });

    it('should return routes matching the test data', function () {
      var routes = whichway.scrapeRoutes(testData);
      assert.deepEqual(routes, rawRoutes, 'routes should match that from test data');
    });

  });

  describe('#parseRoute', function () {
    it('should returned a parsed version of the route', function () {
      assert.deepEqual(whichway.parseRoute(rawRoutes[0]), parsedRoutes[0]);
    });

    //TODO test case for shortDesc where description isn't in config.shortNames (ie: description === shortDesc)
  });

  describe('#getRoutes', function () {
    it('should return an array of sorted, parsed routes', function () {
      assert.deepEqual(whichway.getRoutes(testData), sortedRoutes, 'routes should match sorted, parsed routes from test data');
    });
  });

  describe('#compareCurrTime', function () {
    it('should return -1 if route a is faster than route b', function () {
      var a = parsedRoutes[0];
      var b = parsedRoutes[2];
      assert.equal(whichway.compareCurrTime(a, b), -1, 'result should be -1 when a is faster than b');
    });

    it('should return 1 if route a is slower than route b', function () {
      var a = parsedRoutes[2];
      var b = parsedRoutes[0];
      assert.equal(whichway.compareCurrTime(a, b), 1, 'result should be 1 when a is slower than b');
    });

    it('should return 0 if route a takes the same time as route b', function () {
      var a = parsedRoutes[0];
      var b = parsedRoutes[0];
      assert.equal(whichway.compareCurrTime(a, b), 0, 'result should be 0 when a is the same as b');
    });

    it('should return -1 if route a is has a time and route b is unknown', function () {
      var a = parsedRoutes[0];
      var b = parsedRoutes[1];
      assert.equal(whichway.compareCurrTime(a, b), -1, 'result should be -1 when a is known and b is unknown');
    });

    it('should return 1 if route a is unknown and route b has a time', function () {
      var a = parsedRoutes[1];
      var b = parsedRoutes[0];
      assert.equal(whichway.compareCurrTime(a, b), 1, 'result should be 1 when a is unknown and b is known');
    });

    it('should return 0 if both routes a and b are unknown', function () {
      var a = parsedRoutes[1];
      var b = parsedRoutes[1];
      assert.equal(whichway.compareCurrTime(a, b), 0, 'result should be 0 when both a and b are unknown');
    });
  });

});
