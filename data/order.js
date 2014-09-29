var conn = require('../data/conn');

var order = {
    getone : function(obj, ires, next){

        conn.getConnection(function(err, conn){

            conn.query('SELECT * FROM order_list WHERE ID = '+ obj.id +'', [], function(err, res){
                var result;
                if(!err && res[0]){
                    if((res = res[0]) && res.ID){
                        result = res;
                        conn.query('SELECT * FROM menu WHERE mid = '+ res.mid +'', function(err, res){
                            if(!err){
                                result.menu = res;

                                obj.callback(result);
                            }
                            conn.release();
                        })
                    }
                }else{
                    ires.status(404);
                    next()
                }
            });  

        });

    }
}

module.exports = order;