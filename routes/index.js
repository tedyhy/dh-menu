var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var _ = require('underscore');
var restaurantConn = require('../models/restaurant');
var sign = require('../controllers/sign');
var auth = require('../middlewares/auth');
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

// all router
router.all('*', function(req, res, next) {
	console.log(1111);
	next();
})

// index page
router.get('/', function(req, res, next) {
	auth.userRequired(req, res, next);

	res.redirect('/home/1');
	next();
});

// home page
router.get('/home/:id', function(req, res, next) {
	auth.userRequired(req, res, next);

	var id = req.params.id,
		loginname = res.locals.current_user && res.locals.current_user.name || "",
		obj = {};

	if (id) {
		obj.id = id;
		obj.callback = function(result) {
			res.render('home', {
				title: gtitle,
				id: id,
				loginname: loginname,
				restaurants: result,
				data: JSON.stringify(result)
			});
		}
		restaurantConn.gethome(obj, res, next);
	} else {
		res.status(404);
		next();
	};
});

// order preview router
router.all('/order/preview', function(req, res, next) {
	auth.userRequired(req, res, next);

	var _isAdmin = req.session.user.is_admin;
	// if (!_isAdmin) {
	// 	res.status(404);
	// 	return next();
	// };

	var restid = req.param('restid'),
		uid = req.param('uid'),
		loginname = res.locals.current_user && res.locals.current_user.name || "",
		obj = {},
		_cart = [],
		_restinfo = {};

	(cache.order[111] || []).forEach(function(c, i) {
		c.orderp = _.uniq(c.orderp);
		_cart.push(c);
	});

	// 根据不同分类显示份数
	var _cate_cart = _.countBy(_cart, function(c, i) {
		return c.cate_name;
	});
	var __cate_cart = '';
	for (var i in _cate_cart) {
		__cate_cart += i + '：' + _cate_cart[i] + '份，';
	};

	if (uid && restid) {

		Thenjs(function(cont) {
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
				uid: uid,
				loginname: loginname,
				is_admin: _isAdmin,
				restinfo: _restinfo,
				data: _cart,
				cart: JSON.stringify(_cart),
				cate_cart: __cate_cart
			});

			cont();
		}).
		fin(function(cont, error) {
			// console.log(error, 111)
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

// sign up, login, logout
router.get('/login', sign.showLogin);
router.post('/login', sign.login);
router.all('/logout', sign.signout);
router.get('/register', sign.showSignup);
router.post('/register', sign.signup);

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