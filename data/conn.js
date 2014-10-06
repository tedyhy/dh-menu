// var Client = require('easymysql');

// var mysql = Client.create({
//   'maxconnections' : 100
// });

// mysql.addserver({
//   'host' : 'localhost',
//   'user' : 'root',
//   'password' : '',
//   'database' : 'data_menu'
// });


var mysql = require("mysql");

var pool  = mysql.createPool({
    //host     : "192.168.41.16",
    host     : "localhost",
    database : 'dh_menu',
    user     : "root",
    password : ""
});

module.exports = pool;
