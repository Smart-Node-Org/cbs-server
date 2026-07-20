const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var mysql = require('mysql');


var smart = mysql.createConnection({
host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'smartnodefirstaicompanyinsudan',
  database: 'cbs',
  socketPath: '/var/run/mysqld/mysqld.sock',
  timezone: 'local'

})

var con = mysql.createConnection({
host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'smartnodefirstaicompanyinsudan',
  database: 'cbs',
  socketPath: '/var/run/mysqld/mysqld.sock',
  timezone: 'local'

})


var mail = mysql.createConnection({
host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'smartnodefirstaicompanyinsudan',
  database: 'mail_sender',
    socketPath: '/var/run/mysqld/mysqld.sock',
          timezone: 'local'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("CBS Connected!");
});

mail.connect(function(err) {
  if (err) throw err;
  console.log("Mail Connected!");
});

smart.connect(function(err) {
  if (err) throw err;
  console.log("Smart Node Connected!");
});


module.exports = {con,smart,mail};
