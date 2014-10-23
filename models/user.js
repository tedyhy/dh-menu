/**
 * 用户信息
 */
var Conn = require('./conn');
var User = {
	getUsers: function(obj) {
		Conn.getConnection(function(err, conn) {
			conn.query('SELECT * FROM user WHERE name = \'' + obj.name + '\'', [], function(err, res) {
				conn.release();
				obj.callback(err, res);
			});
		});
	},
	getUserById: function(obj) {
		Conn.getConnection(function(err, conn) {
			conn.query('SELECT * FROM user WHERE id = ' + obj.id, [], function(err, res) {
				conn.release();
				obj.callback(err, res);
			});
		});
	},
	newAndSave: function(obj) {
		Conn.getConnection(function(err, conn) {
			conn.query('INSERT INTO `user`(`name`, `pass`) VALUES(\'' + obj.name + '\', \'' + obj.pass + '\')', function(err) {
				if (!err) {
					conn.query('SELECT * FROM user WHERE name = \'' + obj.name + '\'', [], function(err, res) {
						conn.release();
						obj.callback(err, res);
					});
					return;
				};
				conn.release();
				obj.callback(err);
			});
		});
	}
};

module.exports = User;