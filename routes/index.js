var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var restaurantConn = require('../data/restaurant');
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

/* GET home page. */
router.get('/home/:id', function(req, res, next) {
	var id = req.params.id,
		obj = {};

    if(id){
        obj.id = id;
        obj.callback = function(result){
			res.render('home', {
				title: gtitle,
				id: id,
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
	var restid = req.param('restid'),
		uid = req.param('uid'),
		obj = {},
		_cart = cache.order[111] || [],
		_restinfo = {};

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
				restinfo: _restinfo,
				data: _cart,
				cart: JSON.stringify(_cart)
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

// stay router
router.get('/stay/:id', function(req, res, next) {
	res.render('index', {
		title: gtitle
	});
});

// help router
router.get('/help/:help', function(req, res) {
	var help = 'help/' + req.params.help;
	res.render(help, {
		title: gtitle
	});
});

module.exports = router;