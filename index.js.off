const express = require('express');
const { phpExpress } = require('php-express');
const app = express();

const php = phpExpress({
  binPath: 'php'
});

app.all(/.+\.php$/, php.router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

var sass = require('node-sass');
const { styleText } = require('util');
sass.render({
  file: 'src/styles/style.sass',
}, function(err, result) { /*...*/ });