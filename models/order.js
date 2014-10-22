var Conn = require('./conn');
var Order = {
	getOrders: function(obj) {
		Conn.getConnection(function(err, conn) {
			conn.query('SELECT * FROM order WHERE name = \'' + obj.name + '\'', [], function(err, res) {
				conn.release();
				obj.callback(err, res);
			});
		});
	},
	getOrderById: function(obj) {
		Conn.getConnection(function(err, conn) {
			conn.query('SELECT * FROM order WHERE id = ' + obj.id, [], function(err, res) {
				conn.release();
				obj.callback(err, res);
			});
		});
	},
	newAndSave: function(obj) {
		Conn.getConnection(function(err, conn) {
			conn.query('INSERT INTO `order`(`name`, `order`, `time`) VALUES(\'' + obj.name + '\', \'' + obj.order + '\', unix_timestamp())', function(err) {
				conn.release();
				obj.callback(err);
			});
		});
	}
};

module.exports = Order;