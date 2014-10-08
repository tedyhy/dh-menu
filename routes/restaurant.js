var express = require('express');
var router = express.Router();

var restaurantConn = require('../data/restaurant')

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
router.param('id', /^\d+$/)

/* GET order page. */
router.get('/:id', function(req, res, next) {
	var id = req.params.id,
		ip = req.ip,
		obj = {};

	var restinfo = {
		id: id,
		img_url: 'http://p1.meituan.net/xianfu/1e91ff9ebb8ec442d8b0ba70409dd17216271.jpg',
		name: '人民公社aaa',
		address: '北航西门aaa',
		time: '00:00-23:59'
	}

	var data = [
		{
			name: "家常饭",
			num: 12,
			food: [
				{"id": "2325055", "name": "巴西咖喱牛肉饭1", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325056", "name": "巴西咖喱牛肉饭2", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325057", "name": "巴西咖喱牛肉饭3", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325058", "name": "巴西咖喱牛肉饭4", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325059", "name": "巴西咖喱牛肉饭5", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325060", "name": "巴西咖喱牛肉饭6", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325061", "name": "巴西咖喱牛肉饭7", "price": "19", "minCount": "1" ,"onSale": "1" }
			]
		},
		{
			name: "经典小吃",
			num: 30,
			food: [
				{"id": "2325055", "name": "巴西咖喱牛肉饭1", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325056", "name": "巴西咖喱牛肉饭2", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325057", "name": "巴西咖喱牛肉饭3", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325058", "name": "巴西咖喱牛肉饭4", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325059", "name": "巴西咖喱牛肉饭5", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325060", "name": "巴西咖喱牛肉饭6", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325061", "name": "巴西咖喱牛肉饭7", "price": "19", "minCount": "1" ,"onSale": "1" }
			]
		},
		{
			name: "水果",
			num: 40,
			food: [
				{"id": "2325055", "name": "巴西咖喱牛肉饭1", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325056", "name": "巴西咖喱牛肉饭2", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325057", "name": "巴西咖喱牛肉饭3", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325058", "name": "巴西咖喱牛肉饭4", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325059", "name": "巴西咖喱牛肉饭5", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325060", "name": "巴西咖喱牛肉饭6", "price": "19", "minCount": "1" ,"onSale": "1" },
				{"id": "2325061", "name": "巴西咖喱牛肉饭7", "price": "19", "minCount": "1" ,"onSale": "1" }
			]
		}
	];

	res.render('restaurant', {
		id: id,
		title: 'DH FWD MENU',
		restinfo: restinfo,
		food: data,
		data: JSON.stringify(data)
	});






return;
	if (id) {
		console.log(id);
		obj.id = id;
		obj.callback = function(result) {
			res.render('restaurant', {
				title: 'DH FWD MENU'
				// id: id,
				// ip: ip,
				// mname: result.mname,
				// mphone: result.mphone,
				// peoplenum: result.peoplenum,
				// addtime: result.addtime,
				// order: global.cache.order[id],
				// menu: result.menu
			});
		}
		restaurantConn.getrest(obj, res, next);
	}
});

module.exports = router;