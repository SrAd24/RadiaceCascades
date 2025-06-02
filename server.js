const express = require('express');
const { phpExpress } = require('php-express');
const app = express();

// Настройка PHP
const php = phpExpress({
  binPath: 'php' // Путь к PHP (на Glitch используется встроенный PHP)
});

// Обработка .php файлов
app.all(/.+\.php$/, php.router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});