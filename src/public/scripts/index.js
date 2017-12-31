'use strict';

const Client = require('react-engine/lib/client');

// Include all view files. Browerify doesn't do
// this automatically as it can only operate on
// static require statements.
require('./../../views/Home', {glob: true});

// boot options
const options = {
  // supply a function that can be called
  // to resolve the file that was rendered.
  viewResolver(viewName) {
    return require(`./../../views/${viewName}`);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Client.boot(options);
});
