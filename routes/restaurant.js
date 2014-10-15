var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
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
router.param('id', /^\d+$/);

/* GET order page. */
router.get('/:id', function(req, res, next) {
	var _id = req.params.id,
		_ip = req.ip,
		_obj = {},
		_restinfo = {},
		_data = [],
		_cart = cache.order[111] || [];
	/*

function task(arg, callback) { // 模拟异步任务
  Thenjs.nextTick(function () {
    callback(null, arg);
  });
}

Thenjs(function (cont) {
  task(10, cont);
}).
then(function (cont, arg) {
  console.log(arg);
  cont(new Error('error!'), 123);
}).
fin(function (cont, error, result) {
  console.log(error, result);
  cont();
}).
each([0, 1, 2], function (cont, value) {
  task(value * 2, cont); // 并行执行队列任务，把队列 list 中的每一个值输入到 task 中运行
}).
then(function (cont, result) {
  console.log(result);
  cont();
}).
parallel([ // 串行执行队列任务
  function (cont) { task(8448, cont); }, // 队列第一个是异步任务
  function (cont) { cont(null, 94339); } // 第二个是同步任务
]).
then(function (cont, result) {
  console.log(result, 333333333);
  cont(new Error('error!!'));
}).
fail(function (cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
  console.log(error);
  console.log('DEMO END!');
});
return;*/

	Thenjs.parallel([
		function(cont) {
			var obj = {
				id: _id,
				callback: cont
			};
			restaurantConn.getrest(obj);
		},
		function(cont) {
			var obj = {
				id: _id,
				callback: cont
			};
			restaurantConn.getcate(obj);
		}
	]).
	then(function(cont, result) {
		var r = result[0],
			rr = result[1];

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

		// 餐馆菜品分类

		cont();
	}).
	then(function(cont) {


		_data = [{
			name: "家常饭",
			num: 12,
			food: [{
				"id": "23250551",
				"name": "巴西咖喱牛肉饭1",
				"price": "11",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250561",
				"name": "巴西咖喱牛肉饭2",
				"price": "12",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250571",
				"name": "巴西咖喱牛肉饭3",
				"price": "13",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250581",
				"name": "巴西咖喱牛肉饭4",
				"price": "14",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250591",
				"name": "巴西咖喱牛肉饭5",
				"price": "15",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250601",
				"name": "巴西咖喱牛肉饭6",
				"price": "16",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250611",
				"name": "巴西咖喱牛肉饭7",
				"price": "17",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}]
		}, {
			name: "经典小吃",
			num: 30,
			food: [{
				"id": "23250552",
				"name": "巴西咖喱牛肉饭1",
				"price": "18",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250562",
				"name": "巴西咖喱牛肉饭2",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250572",
				"name": "巴西咖喱牛肉饭3",
				"price": "20",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250582",
				"name": "巴西咖喱牛肉饭4",
				"price": "21",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250592",
				"name": "巴西咖喱牛肉饭5",
				"price": "22",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250602",
				"name": "巴西咖喱牛肉饭6",
				"price": "23",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250612",
				"name": "巴西咖喱牛肉饭7",
				"price": "24",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}]
		}, {
			name: "水果",
			num: 40,
			food: [{
				"id": "23250553",
				"name": "巴西咖喱牛肉饭1",
				"price": "25",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250563",
				"name": "巴西咖喱牛肉饭2",
				"price": "26",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250573",
				"name": "巴西咖喱牛肉饭3",
				"price": "11",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250583",
				"name": "巴西咖喱牛肉饭4",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250593",
				"name": "巴西咖喱牛肉饭5",
				"price": "12",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250603",
				"name": "巴西咖喱牛肉饭6",
				"price": "13",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "23250613",
				"name": "巴西咖喱牛肉饭7",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}]
		}, {
			name: "水果1",
			num: 40,
			food: [{
				"id": "232505531",
				"name": "巴西咖喱牛肉饭1",
				"price": "25",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232505632",
				"name": "巴西咖喱牛肉饭2",
				"price": "26",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232505733",
				"name": "巴西咖喱牛肉饭3",
				"price": "11",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232505834",
				"name": "巴西咖喱牛肉饭4",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232505935",
				"name": "巴西咖喱牛肉饭5",
				"price": "12",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232506036",
				"name": "巴西咖喱牛肉饭6",
				"price": "13",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232506137",
				"name": "巴西咖喱牛肉饭7",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}]
		}, {
			name: "水果2",
			num: 40,
			food: [{
				"id": "2325051",
				"name": "巴西咖喱牛肉饭1",
				"price": "25",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "2325052",
				"name": "巴西咖喱牛肉饭2",
				"price": "26",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "2325053",
				"name": "巴西咖喱牛肉饭3",
				"price": "11",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "2325054",
				"name": "巴西咖喱牛肉饭4",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "2325055",
				"name": "巴西咖喱牛肉饭5",
				"price": "12",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "2325066",
				"name": "巴西咖喱牛肉饭6",
				"price": "13",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "2325067",
				"name": "巴西咖喱牛肉饭7",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}]
		}, {
			name: "水果3",
			num: 40,
			food: [{
				"id": "232501",
				"name": "巴西咖喱牛肉饭1",
				"price": "25",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232502",
				"name": "巴西咖喱牛肉饭2",
				"price": "26",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232503",
				"name": "巴西咖喱牛肉饭3",
				"price": "11",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232504",
				"name": "巴西咖喱牛肉饭4",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232505",
				"name": "巴西咖喱牛肉饭5",
				"price": "12",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232506",
				"name": "巴西咖喱牛肉饭6",
				"price": "13",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}, {
				"id": "232507",
				"name": "巴西咖喱牛肉饭7",
				"price": "19",
				"minCount": "1",
				"onSale": "1",
				"cart": 0
			}]
		}];

		res.render('restaurant', {
			id: _id,
			title: 'DH FWD MENU',
			restinfo: _restinfo,
			food: _data,
			data: JSON.stringify(_data),
			cart: JSON.stringify(_cart)
		});
	}).
	fin(function(cont, error) {
		console.log(error)
		cont();
	}).
	fail(function(cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
		console.log(error)
		res.status(404);
		next();
	});

});

module.exports = router;