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

/* GET order page. */
router.get('/:id', function(req, res, next) {
	var _id = req.params.id,
		_ip = req.ip,
		_obj = {},
		_restinfo = {},
		_data = [],
		_cart = cache.order[111] || [],
		_cates = [],
		_foods = [];

	Thenjs(function(cont) {
		// 获取餐馆详细信息
		var obj = {
			id: _id,
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
			_restinfo.cate = r.cate;
		};

		cont();
	}).
	parallel([
		// 获取餐馆类目信息
		function(cont) {
			var obj = {
				id: _id,
				cate: _restinfo.cate,
				callback: cont
			};
			restaurantConn.getcate(obj);
		},
		// 获取餐馆food信息
		function(cont) {
			var obj = {
				id: _id,
				cate: _restinfo.cate,
				callback: cont
			};
			restaurantConn.getfood(obj);
		}
	]).
	then(function(cont, result) {
		if (result && result.length) {
			// 餐馆菜品分类信息
			_cates = result[0];
			// 获取餐馆food详细信息
			_foods = result[1];
			if (!_cates || !_foods) {
				cont(new Error('the cate && food is not exist!!!'));
			};

		} else {
			cont(new Error('the cates && foods is not exist!!!'));
		};

		cont(null, _cates, _foods);
	}).
	then(function(cont, cates, foods) {
		// 拼接餐馆菜品和food信息成最终信息
		if (cates.length && foods.length) {
			var data = {},
				fs = [];

			cates.forEach(function(c, i) {
				var cs = {};
				cs.id = c.id;
				cs.name = c.name;
				cs.num = 0;
				cs.food = [];
				data[c.id] = cs;
			});
			foods.forEach(function(f, i) {
				var tmp = {},
					cateid, num;
				tmp.id = f.id;
				tmp.name = f.name;
				tmp.price = f.price;
				tmp.like = f.like;
				tmp.cart = 0;
				cateid = f.cate_id;
				num = +data[cateid].num;
				data[cateid].food.push(tmp);
				data[cateid].num = ++num;
			});

			for (var i in data) {
				_data.push(data[i]);
			};

		} else {
			cont(new Error('the food is not exist!!!'));
		};

		cont();
	}).
	then(function(cont) {
		// 渲染页面
		res.render('restaurant', {
			id: _id,
			title: gtitle,
			restinfo: _restinfo,
			food: _data,
			data: JSON.stringify(_data),
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
		next(error);
	});

});

module.exports = router;