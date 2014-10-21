/*
 * 餐馆相关信息
 */
var Conn = require('./conn');

var restaurant = {
	gethome: function(obj, ires, next) {

		Conn.getConnection(function(err, conn) {

			conn.query('SELECT * FROM home WHERE home_id = ' + obj.id, [], function(err, res) {
				res = res && res.length && res || [];
				conn.release();
				obj.callback(err, res);
			});

		});
	},
	getrest: function(obj) {

		Conn.getConnection(function(err, conn) {

			conn.query('SELECT * FROM home WHERE id = ' + obj.id, [], function(err, res) {
				res = res && res.length && res || [];
				conn.release();
				obj.callback(err, res[0]);
			});

		});
	},
	getcate: function(obj) {

		Conn.getConnection(function(err, conn) {

			var cate = obj.cate;
			if (cate) {
				conn.query('SELECT * FROM cate WHERE id in (' + cate + ')', [], function(err, res) {
					res = res && res.length && res || [];

					conn.release();
					obj.callback(err, res);
				});
			} else {
				conn.release();
				obj.callback(err);
			}

		});
	},
	getfood: function(obj) {

		Conn.getConnection(function(err, conn) {

			var id = obj.id,
				cate = obj.cate;
			if (id && cate) {
				conn.query('SELECT * FROM food WHERE rest_id = ' + id + ' and cate_id in (' + cate + ')', [], function(err, res) {
					res = res && res.length && res || [];

					conn.release();
					obj.callback(err, res);
				});
			} else {
				conn.release();
				obj.callback(err);
			}

		});
	}
}

module.exports = restaurant;