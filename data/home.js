/*
 * home相关信息
 */
var conn = require('./conn');

var home = {
	gethome: function(obj, ires, next) {

		conn.getConnection(function(err, conn) {

			conn.query('SELECT * FROM home WHERE home_id = ' + obj.id, [], function(err, res) {

				if (!err) {
					res = res && res.length && res || [];
					obj.callback(res);
					// if ((res = res[0]) && res.id) {
					//     result = res;
					//     conn.query('SELECT * FROM menu WHERE mid = ' + res.mid + '', function(err, res) {
					//         if (!err) {
					//             result.menu = res;

					//             obj.callback(result);
					//         }
					//         conn.release();
					//     })
					// }
				} else {
					ires.status(404);
					next();
				}
				conn.release();
			});

		});
	}
}

module.exports = home;
