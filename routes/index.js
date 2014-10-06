var express = require('express');
var router = express.Router();

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

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		title: 'DH FWD MENU'
	});
});

router.get('/stay/:id', function(req, res) {
	console.log(req.params.id);
	res.render('index', {
		title: 'DH FWD MENU'
	});
});

router.get('/help/:help', function(req, res) {
	var help = req.params.help;
	res.render(help, {
		title: 'DH FWD MENU'
	});
});

module.exports = router;