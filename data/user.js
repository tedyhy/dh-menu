var conn = require('../data/conn');
var user = {
    exists : function(username, callback){
        conn.query('SELECT COUNT(1) AS NUM FROM user WHERE username = "'+ username +'"', function(err, res){
            callback(conn, res);
        });
    },
    reg : function(user){
        this.exists(user.username, function(conn, res){
            if(res[0].NUM && res[0].NUM > 0){
                user.callback(-1);
            }else{
                conn.query('INSERT INTO user(username, password) VALUES("'+ user.username +'", "'+ user.password +'")', function(err){
                    if(!err){
                        conn.query('SELECT max(id) AS id from user;', function(err, res){                            
                            user.callback(res);
                        });
                    }
                });
            }      
        });        
    },
    login : function(user){
        conn.query('SELECT id, username FROM user WHERE username="'+ user.username +'" AND password = "'+ user.password +'"', function(err, res){
            var code = 0;
            if(res[0] && res[0].id){
                code = res[0].id;
            }
            user.callback(code);
        });
    }
}

module.exports = user;