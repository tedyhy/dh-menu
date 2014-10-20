var mysql = require("mysql");

var pool  = mysql.createPool({
    host     : "localhost",
    database : 'dh_menu',
    user     : "root",
    password : ""
});

module.exports = pool;
