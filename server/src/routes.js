/* @flow */
const sys = require('util');
const path = require('path');
const logger = require('winston');
const _ = require('underscore');
const backstrokeLib = require('./backstroke');
const foursquareLib = require('node-foursquare');

module.exports.addRoutes = (app, config) => {
  const Backstroke = backstrokeLib(config);
  const Foursquare = foursquareLib(config.foursquare);

  function getMonths(month: ?number): Array<{ value: number, text: string }> {
    const val = month || new Date().getMonth();

    const months = [
      { value: 0, text: '01' },
      { value: 1, text: '02' },
      { value: 2, text: '03' },
      { value: 3, text: '04' },
      { value: 4, text: '05' },
      { value: 5, text: '06' },
      { value: 6, text: '07' },
      { value: 7, text: '08' },
      { value: 8, text: '09' },
      { value: 9, text: '10' },
      { value: 10, text: '11' },
      { value: 11, text: '12' },
    ];

    return months.map(monthItem => {
      const { value, text } = monthItem;
      return {
        value,
        text,
        selected: value === val,
      };
    });
  }

  function getYears(
    selectedYear: ?number,
  ): Array<{ value: number, text: string, selected: boolean }> {
    const years = [];
    const currentYear = new Date().getFullYear();
    const year = selectedYear || currentYear;

    for (let i = currentYear; i >= config.foursquare.startYear; i -= 1) {
      const aYear = {
        value: i,
        text: i,
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
      logger.debug(`BEFORE: ${req.url}`);
      const loc = `/login${req.url ? `?r=${encodeURIComponent(req.url)}` : ''}`;
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

  app.get('/login', (req, res) => {
    logger.debug('REQUESTING: /login');
    const loc = Foursquare.getAuthClientRedirectUrl();
    res.writeHead(303, { location: loc });
    res.end();
  });

  app.get('/callback/foursquare', (req, res) => {
    logger.debug('REQUESTING: /callback/foursquare');
    logger.debug('ENTERING: processTokenCallback');
    const { query } = req;
    const { code, r } = query;
    const redirect = r || '/trips';

    Foursquare.getAccessToken(
      {
        code,
      },
      (acError, accessToken) => {
        if (acError) {
          logger.error(`Error retrieving Access Token: ${acError.message}`);
          res.redirect('/error?no_token');
        } else if (accessToken) {
          Foursquare.Users.getUser('self', accessToken, (guError, user) => {
            if (guError) {
              res.redirect('/error?bad_user');
            } else {
              req.session.foursquare = {
                user: user.user,
                accessToken,
              };
              logger.debug(`Redirecting to ${redirect}`);
              delete req.query.code;
              delete req.query.c;
              res.redirect(redirect);
            }
          });
        } else {
          logger.error('No Access Token was received.');
          res.redirect('/error?no_token');
        }
      },
    );
  });

  app.get('/disconnect', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  function buildTripForm(request) {
    const { query } = request;
    const today = new Date();
    const form = {};

    form.zip = query.zip || '';

    if (query.a) {
      form.advanced = {
        startMonths: getMonths(query.sm),
        startYears: getYears(query.sy || today.getFullYear() - 1),
        endMonths: getMonths(query.em),
        endYears: getYears(query.ey || today.getFullYear()),
        homeRadius: query.hr || config.defaults.homeRadius,
        cityRadius: query.cr || config.defaults.cityRadius,
        tripMinimum: query.tm || config.defaults.tripMinimum,
      };
      form.id = JSON.stringify(form);
    }
    return form;
  }

  app.get('/trips', restrict, (req, res) => {
    logger.debug('REQUESTING: /trips');
    const { session } = req;
    const { foursquare } = session;
    const { accessToken } = foursquare;
    const form = buildTripForm(req);

    // req.session.checkins = req.session.checkins || {};

    if (form.zip) {
      const selected = item => {
        if (item.selected) {
          logger.debug(sys.inspect(item));
        }
        return item.selected;
      };

      let options = {};

      if (form.advanced) {
        const ey = parseInt(
          _.select(form.advanced.endYears, selected)[0].value,
          10,
        );
        const em = parseInt(
          _.select(form.advanced.endMonths, selected)[0].value,
          10,
        );
        const sy = parseInt(
          _.select(form.advanced.startYears, selected)[0].value,
          10,
        );
        const sm = parseInt(
          _.select(form.advanced.startMonths, selected)[0].value,
          10,
        );
        const before = new Date(ey, em + 1, 0, 0, 0, 0, 0);
        const after = new Date(sy, sm, 1, 0, 0, 0, 0);

        options = {
          after,
          before,
          homeRadius: form.advanced.homeRadius,
          cityRadius: form.advanced.cityRadius,
          tripMinimum: form.advanced.tripMinimum,
        };
      }

      const process = (error, trips) => {
        if (error) {
          logger.error(sys.inspect(error));
          res.redirect('/error');
        } else {
          // req.session.checkins[form.id] = checkins;
          const props = {
            data: trips,
            user: req.session.foursquare.user,
            form,
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
      const props = {
        data: null,
        form,
      };
      res.sendFile(path.join(__dirname, 'build', 'trips.html'));
    }
  });

  app.get('/logout', (req, res) => {
    delete req.session.foursquare;
    res.redirect('/');
  });
};
