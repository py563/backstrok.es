const transform = require('babel-transform-dir');

module.exports = () => {
  return transform('./src', './build', {
    babel: {
      presets: ['env', 'flow'],
    },
    onFile: file => {
      console.log(`src/${file} -> build/${file}`);
    },
  });
};
