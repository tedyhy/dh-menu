var conn = require('../data/conn');
var work = {
    getall : function(obj){
        conn.query('SELECT * FROM work WHERE uid = ' + obj.uid + ' ORDER BY addtime DESC', function(err, res){
            var result = res;

            if(result.length){
                for(var i = 0; i < result.length; i++){
                    ~function(i){
                        conn.query('SELECT * FROM work_day WHERE uid = '+ obj.uid +' AND wid = '+ result[i].id +' ORDER BY thistime ASC', function(err, res){
                            result[i] && (result[i].singledays = res);
                            if(i === result.length - 1){
                                obj.callback(result);
                            }
                        });
                    }(i);                    
                }
            }
        });
    },
    add : function(obj){
        conn.query('INSERT INTO work(addtime, title, interface, level, status, days, bgcolor, memo, uid) VALUES("'+ obj.addtime +'", "'+ obj.title +'", "'+ obj.interface +'", "'+ obj.level +'", "'+ obj.status +'", '+ obj.days +', "'+ obj.bgcolor +'", "'+ obj.memo +'", '+ obj.uid +')', function(err, res){
            conn.query('SELECT max(id) AS id FROM work WHERE uid = '+ obj.uid +'', function(err, res){
                var wid = res[0].id,
                    singledays = obj.singledays
                    ;
                if(obj.singledays && singledays.length > 0){
                    for(var i = 0; i < singledays.length; i++){  
                        ~function(i){
                            conn.query('INSERT INTO work_day(uid, wid, title, interface, thistime, bgcolor) VALUES('+ obj.uid +', '+ wid +', "'+ obj.title +'", "'+ obj.interface +'", "'+ singledays[i] +'", "'+ obj.bgcolor +'")', function(err, res){
                                if(i === singledays.length - 1){                                
                                    obj.callback(res);
                                }
                            });
                        }(i);
                    }
                }else{
                    obj.callback(res);
                }
            });
        });
    },
    mod : function(obj){
        conn.query('UPDATE work SET addtime = "'+ obj.addtime +'", title = "'+ obj.title +'", interface = "'+ obj.interface +'", level = "'+ obj.level +'", status = "'+ obj.status +'", days = '+ obj.days +', bgcolor = "'+ obj.bgcolor +'", memo = "'+ obj.memo +'" WHERE id = ' + obj.id, function(err, res){
            var wid = obj.id,
                singledays = obj.singledays
                ;
                
            conn.query('DELETE FROM work_day WHERE uid = '+ obj.uid +' AND wid = '+ obj.id +'', function(err, res){                
                if(obj.singledays && singledays.length > 0){
                    for(var i = 0; i < singledays.length; i++){  
                        ~function(i){
                            conn.query('INSERT INTO work_day(uid, wid, title, interface, thistime, bgcolor) VALUES('+ obj.uid +', '+ wid +', "'+ obj.title +'", "'+ obj.interface +'", "'+ singledays[i] +'", "'+ obj.bgcolor +'")', function(err, res){
                                if(i === singledays.length - 1){                                
                                    obj.callback(res);
                                }
                            });
                        }(i);
                    }
                }else{
                    obj.callback(res);
                }
            });
        });
    },
    del : function(obj){
        conn.query('DELETE FROM work WHERE id = ' + obj.id + ' AND uid = ' + obj.uid, function(err, res){
            conn.query('DELETE FROM work_day WHERE wid = ' + obj.id + ' AND uid = ' + obj.uid, function(err, res){

            });
            obj.callback(res);
        });
    },
    getdaysbyym : function(obj){
        conn.query('SELECT * FROM work_day WHERE uid = '+ obj.uid +' AND YEAR(thistime) = '+ obj.year +' AND MONTH(thistime) = '+ obj.month +'', function(err, res){
            obj.callback(res);
        });
    }
}

module.exports = work;