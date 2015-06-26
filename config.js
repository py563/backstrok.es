
exports.config = function() {

  var appDefaults = {
    "concurrentCalls" : 3,
    "before" : 0,
    "after" : 0,
    "limit" : 250,
    "homeRadius" : 50,
    "cityRadius" : 20,
    "distanceUnit" : "miles",
    "tripMinimum" : 2
  };

  var configs = {
    "remote" : {
      "port" : process.env.PORT || 3000,
      "session" : {
        "secret" : process.env.SESSION_SECRET,
        "age" : 60000,
        "impl" : "memory"
      },
      "yahoo" : {
        "appId" : process.env.YAHOO_APP_ID
      },
      "foursquare" : {
        "secrets" : {
          "redirectUrl" : process.env.FSQ_REDIRECT,
          "clientId" : process.env.FSQ_CLIENT_ID,
          "clientSecret" : process.env.FSQ_CLIENT_SECRET,
        },
        "startYear" : 2009
      },
      "defaults" : appDefaults
    },
    "local" : {
      "port" : 3000,
      "session" : {
        "secret" : "YOUR SECRET",
        "age" : 3000,
        "impl" : "memory"
      },
      "yahoo" : {
        "appId" : "YOUR APP ID"
      },
      "foursquare" : {
        "secrets" : {
          "redirectUrl" : "YOUR CALLBACK",
          "clientId" : "YOUR CLIENT ID",
          "clientSecret" : "YOUR CLIENT SECRET"
        },
        "startYear" : 2009
      },
      "defaults" : appDefaults
    },
    "defaultConfig" : "remote"
  };

  function getConfig(n) {
    if(!configs[n]) {
      return configs[configs.defaultConfig];
    }
    return configs[n];
  }

  return {
    "configs" : configs,
    "getConfig" : getConfig
  };
}();
