
var sys = require('util'),
  fs = require('fs'),
  _ = require('underscore');

exports.addRoutes = module.exports.addRoutes = function(app, config) {
  var logger = require('winston'),
    Backstroke = require('./lib/backstroke')(config),
    Foursquare = require('node-foursquare')(config.foursquare);

  function getMonths(val) {
    val = val || new Date().getMonth();

    var months = [
      {'value' : 0, 'text' : '01'}, {'value' : 1, 'text' : '02'},
      {'value' : 2, 'text' : '03'}, {'value' : 3, 'text' : '04'},
      {'value' : 4, 'text' : '05'}, {'value' : 5, 'text' : '06'},
      {'value' : 6, 'text' : '07'}, {'value' : 7, 'text' : '08'},
      {'value' : 8, 'text' : '09'}, {'value' : 9, 'text' : '10'},
      {'value' : 10, 'text' : '11'}, {'value' : 11, 'text' : '12'}];

    _.each(months, function(n) {
      if(n.value == val) {
        n.selected = true;
      }
    });
    return _.toArray(months);
  }

  function getYears(val) {
    var years = [], cur = new Date().getFullYear();
    val = val || cur;
    for(var i = cur; i >= config.foursquare.startYear; i--) {
      var v = {
        'value' : i,
        'text' : i
      };
      if(i == val) {
        v.selected = true;
      }
      years.push(v);
    }
    return _.toArray(years);
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

  app.all('/', function getHome(req, res) {
    var data = {};
    if(req.session.foursquare) {
      data.session = req.session;
    }
    res.render('Home.jsx', data);
  });

  app.get('/login', function login(req, res) {
    var r = req.query.r;
    logger.debug('REQUESTING: /login');
    var loc = Foursquare.getAuthClientRedirectUrl();
    res.writeHead(303, { 'location': loc });
    res.end();
  });

  app.get('/callback/foursquare', function getFoursquareCallback(req, res) {
    logger.debug('REQUESTING: /callback/foursquare');

    logger.debug('ENTERING: processTokenCallback');
    var code = req.query.code, redirect = req.query.r || '/trips';

    Foursquare.getAccessToken({
      code: code
    }, function (error, access_token) {
      if(error) {
        logger.error('Error retrieving Access Token: ' + error.message);
        res.redirect('/error?no_token');
      }
      else if(access_token) {
        Foursquare.Users.getUser('self', access_token, function(error, user) {
          if(error) {
            res.redirect('/error?bad_user');
          }
          else {
            req.session.foursquare = {
              'user' : user.user,
              'accessToken' : access_token
            };
            logger.debug('Redirecting to ' + redirect);
            delete req.query.code;
            delete req.query.c;
            res.redirect(redirect);
          }
        });
      }
      else {
        logger.error('No Access Token was received.');
        res.redirect('/error?no_token');
      }
    });
  });

  app.get('/disconnect', function(req, res) {
    req.session.destroy(function(){
      res.redirect('/');
    });
  });

  function buildTripForm(request) {
    var query = request.query, today = new Date(), form = {};
    form.zip = query.zip || '';
    if(query.a) {
      form.advanced = {
        'startMonths' : getMonths(query.sm),
        'startYears' : getYears(query.sy || today.getFullYear() - 1),
        'endMonths' : getMonths(query.em),
        'endYears' : getYears(query.ey || today.getFullYear()),
        'homeRadius' : query.hr || config.defaults.homeRadius,
        'cityRadius' : query.cr || config.defaults.cityRadius,
        'tripMinimum' : query.tm || config.defaults.tripMinimum
      };
      form.id = JSON.stringify(form);
    }
    return form;
  }

  app.get('/trips', restrict, function getTrips(req, res) {
    logger.debug('REQUESTING: /trips');

    var accessToken = req.session.foursquare.accessToken,
      form = buildTripForm(req);

    //req.session.checkins = req.session.checkins || {};

    if(form.zip) {
      var selected = function(item) {
        if(item.selected) {
          logger.debug(sys.inspect(item));
        }
        return item.selected;
      };

      var options = {};

      if(form.advanced) {
        var ey = parseInt(_.select(form.advanced.endYears, selected)[0].value),
          em = parseInt(_.select(form.advanced.endMonths, selected)[0].value),
          sy = parseInt(_.select(form.advanced.startYears, selected)[0].value),
          sm = parseInt(_.select(form.advanced.startMonths, selected)[0].value),
          before = new Date(ey, em + 1, 0, 0, 0, 0, 0),
          after = new Date(sy, sm, 1, 0, 0, 0, 0);

        options = {
          'after' : after,
          'before' : before,
          'homeRadius' : form.advanced.homeRadius,
          'cityRadius' : form.advanced.cityRadius,
          'tripMinimum' : form.advanced.tripMinimum
        };
      }

      var process = function(error, trips, checkins, location) {

        if(error) {
          logger.error(sys.inspect(error));
          res.redirect('/error');
        }
        else {
          //req.session.checkins[form.id] = checkins;
          var props = {
            'data' : trips,
            'user' : req.session.foursquare.user,
            'form' : form
          };
          res.render('Trips.jsx', props);
        }
      };

      logger.debug(req.session.checkins);

      /*if(req.session.checkins[form.id]) {
        logger.debug('Using session data to build trips.');
        Backstroke.buildTripsByZip(req.session.checkins[form.id], form.zip, options, process);
      }
      else {*/
        logger.debug('Retrieving checkins to build trips.');
        Backstroke.retrieveTrips(form.zip, options, accessToken, process);
      /*}*/
    }
    else {
      var props = {
        'data' : null,
        'form' : form
      };
      res.render('Trips.jsx', props);
    }
  });

  app.get('/logout', function(req, res) {
    delete req.session.foursquare;
    res.redirect('/');
  });
};
