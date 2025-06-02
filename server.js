const express = require('express');
const { phpExpress } = require('php-express');
const app = express();

// ��������� PHP
const php = phpExpress({
  binPath: 'php' // ���� � PHP (�� Glitch ������������ ���������� PHP)
});

// ��������� .php ������
app.all(/.+\.php$/, php.router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});