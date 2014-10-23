var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var _ = require('underscore');
var restaurantConn = require('../models/restaurant');
var User = require('../models/user');
var Order = require('../models/order');
var sign = require('../controllers/sign');
var auth = require('../middlewares/auth');
var utils = require('../common/utils');
var config = require('../config.default');
var gtitle = 'DH FWD MENU';

/* 参数过滤 */
router.param(function(name, fn) {
	if (fn instanceof RegExp) {
		return function(req, res, next, val) {
			var captures;
			if (captures = fn.exec(String(val))) {
				req.params[name] = captures;
				next();
			} else {
				next('route');
			}
		}
	}
});
router.param('id', /^\d+$/);
router.param('oid', /^[0-9a-zA-Z]+$/);

// all router
router.all('*', function(req, res, next) {
	console.log(1111);
	next();
})

// index page
router.get('/', function(req, res, next) {
	auth.userRequired(req, res, next);

	if (req.session.user) {
		return res.redirect('/home/1');
	}
});

// sign up, login, logout
router.get('/login', sign.showLogin);
router.post('/login', sign.login);
router.all('/logout', sign.signout);
router.get('/register', sign.showSignup);
router.post('/register', sign.signup);

// home page
router.get('/home/:id', function(req, res, next) {
	auth.userRequired(req, res, next);

	var id = req.params.id,
		loginname = res.locals.current_user && res.locals.current_user.name || "",
		obj = {};

	if (id && loginname) {

		Thenjs(function(cont) {
			// 获取home所有餐馆信息
			var obj = {
				id: id,
				callback: cont
			};
			restaurantConn.gethome(obj);
		}).
		then(function(cont, result) {
			result.forEach(function(r, i) {
				r.token = utils.encrypt(r.id + '\t' + loginname, config.session_secret);
			});

			cont(null, result);
		}).
		then(function(cont, result) {
			// 渲染页面
			res.render('home', {
				title: gtitle,
				id: id,
				loginname: loginname,
				restaurants: result,
				data: JSON.stringify(result)
			});

			cont();
		}).
		fail(function(cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
			console.log(error);
			res.status(404);
			next();
		});
	} else {
		res.status(404);
		next();
	};
});

// order preview router
router.all('/order/preview/:oid', function(req, res, next) {
	auth.userRequired(req, res, next);

	var oid = req.params.oid,
		loginname = res.locals.current_user && res.locals.current_user.name || "";

	if (!oid || !loginname) {
		res.status(404);
		return next('无餐馆加密后的id！');
	};

	var auth_token = utils.decrypt(oid[0], config.session_secret) || '';

	if (!auth_token) {
		res.status(404);
		return next('餐馆加密后的id错误！');
	};

	var auth_tokens = auth_token.split('\t'),
		restid = +auth_tokens[0] || '',
		uid = auth_tokens[1] || '';

	if (!restid || !uid) {
		res.status(404);
		return next('餐馆加密信息错误！');
	};

	var _isAdmin = req.session.user.is_admin;

	var obj = {},
		_cart = [],
		_restinfo = {};

	_.clone(cache.order[uid] || []).forEach(function(c, i) {
		c.orderp = _.uniq(c.orderp);
		_cart.push(c);
	});

	// 统计不同分类显示份数
	var _cate_cart = {},
		_cate_cart_num = 0,
		__cate_cart = '';
	_.clone(_cart).forEach(function(c, i) {
		if (c.cate_name in _cate_cart) {
			_cate_cart[c.cate_name] += c.cart;
		} else {
			_cate_cart[c.cate_name] = c.cart;
		};
		_cate_cart_num += c.cart;
	});
	for (var i in _cate_cart) {
		__cate_cart += i + '：' + _cate_cart[i] + '份，';
	};
	__cate_cart += '共' + _cate_cart_num + '份';


	// 渲染页面订单详情页
	if (uid && restid) {

		Thenjs(function(cont) {
			// 验证订餐发起人uid
			var obj = {
				name: uid,
				callback: cont
			};
			User.getUsers(obj);
		}).then(function(cont) {
			// 获取餐馆详细信息
			var obj = {
				id: restid,
				callback: cont
			};
			restaurantConn.getrest(obj);
		}).
		then(function(cont, r) {
			// 餐馆信息
			if (!r || !'id' in r) {
				cont(new Error('the id is not exist!!!'));
			} else {
				_restinfo.id = r.id;
				_restinfo.img_url = r.img_url;
				_restinfo.name = r.name;
				_restinfo.address = r.address;
				_restinfo.time = r.time;
				_restinfo.broad_content = r.broad_content;
			};

			cont();
		}).
		then(function(cont) {
			// 渲染页面
			res.render('order/preview', {
				title: gtitle,
				token: oid,
				loginname: loginname,
				is_admin: _isAdmin,
				restinfo: _restinfo,
				data: _cart,
				cart: JSON.stringify(_cart),
				cate_cart: __cate_cart
			});

			cont();
		}).
		fail(function(cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
			console.log(error);
			res.status(404);
			next();
		});

	} else {
		res.status(404);
		next();
	};
});

// the api of save order
router.post('/order/preview/api/saveorder', function(req, res, next) {

	var loginname = res.locals.current_user && res.locals.current_user.name || "";
	if (!req.session || !req.session.user || !loginname) {
		res.json({
			code: -1,
			msg: "the user must be logining"
		});
	};

	var ordercxt = req.body.order || '';
	if (!ordercxt) {
		return res.json({
			code: -2,
			msg: "the order content must be"
		});
	};

	Thenjs(function(cont) {
		var obj = {
			name: loginname,
			order: JSON.stringify(ordercxt),
			callback: cont
		};
		Order.newAndSave(obj);

	}).then(function(cont) {
		// 清空服务器订单相关缓存
		// try {
		// 	if (loginname in cache.order) {
		// 		cache.order[loginname] = null;
		// 		delete cache.order[loginname];
		// 	};

		// } catch (ex) {
		// 	console.log(ex);
		// };

		return res.json({
			code: 0,
			msg: "success"
		});
	}).
	fail(function(cont, error) {
		console.log(error);
		return res.json({
			code: -3,
			msg: "fail"
		});
	});

});

// stay router
router.get('/stay/:id', function(req, res, next) {
	res.render('index', {
		title: gtitle,
		loginname: res.locals.current_user.name
	});
});

// help router
router.get('/help/:help', function(req, res) {
	var help = 'help/' + req.params.help;
	res.render(help, {
		title: gtitle,
		loginname: res.locals.current_user.name
	});
});

module.exports = router;