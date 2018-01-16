const transformServerFiles = require('./transform');
const chalk = require('chalk');

transformServerFiles().then(() => {
  console.log(chalk.cyan('Starting the node server...\n'));

  ['SIGINT', 'SIGTERM'].forEach(function(sig) {
    process.on(sig, function() {
      process.exit();
    });
  });

  const nodemon = require('nodemon');
  nodemon({
    script: 'build/index.js',
    ext: 'js json',
    watch: ['src'],
  }).on('restart', function(files) {
    transformServerFiles();
  });
});
