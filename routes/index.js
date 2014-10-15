var express = require('express');
var router = express.Router();
var restaurantConn = require('../data/restaurant');

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
        	console.log(result);
			res.render('home', {
				title: 'DH FWD MENU',
				id: id,
				restaurants: result,
				data: JSON.stringify(result)
			});
        }
        restaurantConn.gethome(obj, res, next);        
    }
});

// order preview router
router.all('/order/preview', function(req, res, next) {
	var uid = req.param('shop_cart');
	res.render('order/preview', {
		title: 'DH FWD MENU'
	});
});

// stay router
router.get('/stay/:id', function(req, res, next) {
	console.log(req.params.id);
	res.render('index', {
		title: 'DH FWD MENU'
	});
});

// help router
router.get('/help/:help', function(req, res) {
	var help = 'help/' + req.params.help;
	console.log(help)
	res.render(help, {
		title: 'DH FWD MENU'
	});
});

module.exports = router;