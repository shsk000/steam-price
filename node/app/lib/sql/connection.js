const mysql = require('promise-mysql');

module.exports = async () => {
  const connection = await mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    charset: 'utf8mb4',
  });

  return connection;
};
