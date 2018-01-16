'use strict';

var sys = require('util');
var path = require('path');
var logger = require('winston');
var _ = require('underscore');
var backstrokeLib = require('./backstroke');
var foursquareLib = require('node-foursquare');

module.exports.addRoutes = function (app, config) {
  var Backstroke = backstrokeLib(config);
  var Foursquare = foursquareLib(config.foursquare);

  function getMonths(month) {
    var val = month || new Date().getMonth();

    var months = [{ value: 0, text: '01' }, { value: 1, text: '02' }, { value: 2, text: '03' }, { value: 3, text: '04' }, { value: 4, text: '05' }, { value: 5, text: '06' }, { value: 6, text: '07' }, { value: 7, text: '08' }, { value: 8, text: '09' }, { value: 9, text: '10' }, { value: 10, text: '11' }, { value: 11, text: '12' }];

    return months.map(function (monthItem) {
      var value = monthItem.value,
          text = monthItem.text;

      return {
        value: value,
        text: text,
        selected: value === val
      };
    });
  }

  function getYears(selectedYear) {
    var years = [];
    var currentYear = new Date().getFullYear();
    var year = selectedYear || currentYear;

    for (var i = currentYear; i >= config.foursquare.startYear; i -= 1) {
      var aYear = {
        value: i,
        text: i
      };
      if (i === year) {
        aYear.selected = true;
      }
      years.push(aYear);
    }
    return years;
  }

  function restrict(req, res, next) {
    logger.debug('Entering: /restrict');

    if (req.session.foursquare) {
      next();
    } else {
      logger.debug('BEFORE: ' + req.url);
      var loc = '/login' + (req.url ? '?r=' + encodeURIComponent(req.url) : '');
      res.redirect(loc);
    }
  }

  /*app.all('/', (req, res) => {
    const data = {};
    if (req.session.foursquare) {
      data.session = req.session;
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });*/

  app.get('/login', function (req, res) {
    logger.debug('REQUESTING: /login');
    var loc = Foursquare.getAuthClientRedirectUrl();
    res.writeHead(303, { location: loc });
    res.end();
  });

  app.get('/callback/foursquare', function (req, res) {
    logger.debug('REQUESTING: /callback/foursquare');
    logger.debug('ENTERING: processTokenCallback');
    var query = req.query;
    var code = query.code,
        r = query.r;

    var redirect = r || '/trips';

    Foursquare.getAccessToken({
      code: code
    }, function (acError, accessToken) {
      if (acError) {
        logger.error('Error retrieving Access Token: ' + acError.message);
        res.redirect('/error?no_token');
      } else if (accessToken) {
        Foursquare.Users.getUser('self', accessToken, function (guError, user) {
          if (guError) {
            res.redirect('/error?bad_user');
          } else {
            req.session.foursquare = {
              user: user.user,
              accessToken: accessToken
            };
            logger.debug('Redirecting to ' + redirect);
            delete req.query.code;
            delete req.query.c;
            res.redirect(redirect);
          }
        });
      } else {
        logger.error('No Access Token was received.');
        res.redirect('/error?no_token');
      }
    });
  });

  app.get('/disconnect', function (req, res) {
    req.session.destroy(function () {
      res.redirect('/');
    });
  });

  function buildTripForm(request) {
    var query = request.query;

    var today = new Date();
    var form = {};

    form.zip = query.zip || '';

    if (query.a) {
      form.advanced = {
        startMonths: getMonths(query.sm),
        startYears: getYears(query.sy || today.getFullYear() - 1),
        endMonths: getMonths(query.em),
        endYears: getYears(query.ey || today.getFullYear()),
        homeRadius: query.hr || config.defaults.homeRadius,
        cityRadius: query.cr || config.defaults.cityRadius,
        tripMinimum: query.tm || config.defaults.tripMinimum
      };
      form.id = JSON.stringify(form);
    }
    return form;
  }

  app.get('/trips', restrict, function (req, res) {
    logger.debug('REQUESTING: /trips');
    var session = req.session;
    var foursquare = session.foursquare;
    var accessToken = foursquare.accessToken;

    var form = buildTripForm(req);

    // req.session.checkins = req.session.checkins || {};

    if (form.zip) {
      var _selected = function _selected(item) {
        if (item.selected) {
          logger.debug(sys.inspect(item));
        }
        return item.selected;
      };

      var options = {};

      if (form.advanced) {
        var ey = parseInt(_.select(form.advanced.endYears, _selected)[0].value, 10);
        var em = parseInt(_.select(form.advanced.endMonths, _selected)[0].value, 10);
        var sy = parseInt(_.select(form.advanced.startYears, _selected)[0].value, 10);
        var sm = parseInt(_.select(form.advanced.startMonths, _selected)[0].value, 10);
        var before = new Date(ey, em + 1, 0, 0, 0, 0, 0);
        var after = new Date(sy, sm, 1, 0, 0, 0, 0);

        options = {
          after: after,
          before: before,
          homeRadius: form.advanced.homeRadius,
          cityRadius: form.advanced.cityRadius,
          tripMinimum: form.advanced.tripMinimum
        };
      }

      var process = function process(error, trips) {
        if (error) {
          logger.error(sys.inspect(error));
          res.redirect('/error');
        } else {
          // req.session.checkins[form.id] = checkins;
          var props = {
            data: trips,
            user: req.session.foursquare.user,
            form: form
          };
          res.render('Trips', props);
        }
      };

      logger.debug(req.session.checkins);

      /* if(req.session.checkins[form.id]) {
        logger.debug('Using session data to build trips.');
        Backstroke.buildTripsByZip(req.session.checkins[form.id], form.zip, options, process);
      }
      else { */
      logger.debug('Retrieving checkins to build trips.');
      Backstroke.retrieveTrips(form.zip, options, accessToken, process);
      /* } */
    } else {
      var props = {
        data: null,
        form: form
      };
      res.sendFile(path.join(__dirname, 'build', 'trips.html'));
    }
  });

  app.get('/logout', function (req, res) {
    delete req.session.foursquare;
    res.redirect('/');
  });
};