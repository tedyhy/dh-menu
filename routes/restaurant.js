var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var _ = require('underscore');
var restaurantConn = require('../models/restaurant');
var User = require('../models/user');
var auth = require('../middlewares/auth');
var config = require('../config.default');
var utils = require('../common/utils');
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
router.param('id', /^[0-9a-zA-Z]+$/);

/* GET order page. */
router.get('/:id', function(req, res, next) {
	auth.userRequired(req, res, next);

	var loginname = res.locals.current_user && res.locals.current_user.name || "",
		id = req.params.id;

	if (!id || !loginname) {
		res.status(404);
		return next('无餐馆加密后的id！');
	};

	var auth_token = utils.decrypt(id[0], config.session_secret) || '';

	if (!auth_token) {
		res.status(404);
		return next('餐馆加密后的id错误！');
	};

	var auth_tokens = auth_token.split('\t'),
		_id = +auth_tokens[0] || '',
		_fqadmin = auth_tokens[1] || '';

	if (!_id || !_fqadmin) {
		res.status(404);
		return next('餐馆加密信息错误！');
	};

	var _isAdmin = req.session.user.is_admin,
		_obj = {},
		_restinfo = {},
		_data = [],
		_cart = _.clone(cache.order[_fqadmin] || []),
		_cates = [],
		_foods = [];

	Thenjs(function(cont) {
		// 验证订餐发起人_fqadmin
		var obj = {
			name: _fqadmin,
			callback: cont
		};
		User.getUsers(obj);
	}).then(function(cont) {
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
			_restinfo.type = r.type;
			_restinfo.muslim = r.muslim;
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
				tmp.ordernum = f.order_num;
				tmp.cate_name = data[f.cate_id].name;
				tmp.orderp = []; // 点了此菜品的人员
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
			is_admin: _isAdmin,
			restinfo: _restinfo,
			food: _data,
			data: JSON.stringify(_data),
			cart: JSON.stringify(_cart),
			loginname: loginname,
			fquser: _fqadmin,
			token: id
		});

		cont();
	}).
	fail(function(cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
		console.log(error);
		res.status(404);
		next(error);
	});

});

module.exports = router;