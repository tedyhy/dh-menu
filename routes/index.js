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
        restaurantConn.getone(obj, res, next);        
    }
return;
	var restaurants = [{
		name: 'aaaaaaaaaaa',
		href: '/restaurant/32991',
		img_url: 'http://p1.meituan.net/75.0/xianfu/1e91ff9ebb8ec442d8b0ba70409dd17216271.jpg',
		broadcontent: '食之可口，味之鲜美，府之开阔，玉盘珍馐不如五谷杂粮之康体。我们是富有专业敬业与激情的团体，愿给予我们一次展现接触的机会，专业敬业精确 珍惜感恩回馈，坚持食品安全严把关，绝不触碰食品安全的红线，踏实做事 让健康的饮食与所选的食材有必然的关联， 我们愿用真诚来换取您的认可！！！'
	},
	{
		name: 'bbbbbb',
		href: '/restaurant/32991',
		img_url: 'http://p1.meituan.net/75.0/xianfu/1e91ff9ebb8ec442d8b0ba70409dd17216271.jpg',
		broadcontent: '食之可口，味之鲜美，府之开阔，玉盘珍馐不如五谷杂粮之康体。我们是富有专业敬业与激情的团体，愿给予我们一次展现接触的机会，专业敬业精确 珍惜感恩回馈，坚持食品安全严把关，绝不触碰食品安全的红线，踏实做事 让健康的饮食与所选的食材有必然的关联， 我们愿用真诚来换取您的认可！！！'
	},
	{
		name: 'cccccc',
		href: '/restaurant/32991',
		img_url: 'http://p1.meituan.net/75.0/xianfu/1e91ff9ebb8ec442d8b0ba70409dd17216271.jpg',
		broadcontent: '食之可口，味之鲜美，府之开阔，玉盘珍馐不如五谷杂粮之康体。我们是富有专业敬业与激情的团体，愿给予我们一次展现接触的机会，专业敬业精确 珍惜感恩回馈，坚持食品安全严把关，绝不触碰食品安全的红线，踏实做事 让健康的饮食与所选的食材有必然的关联， 我们愿用真诚来换取您的认可！！！'
	},
	{
		name: 'ddddd',
		href: '/restaurant/32991',
		img_url: 'http://p1.meituan.net/75.0/xianfu/1e91ff9ebb8ec442d8b0ba70409dd17216271.jpg',
		broadcontent: '食之可口，味之鲜美，府之开阔，玉盘珍馐不如五谷杂粮之康体。我们是富有专业敬业与激情的团体，愿给予我们一次展现接触的机会，专业敬业精确 珍惜感恩回馈，坚持食品安全严把关，绝不触碰食品安全的红线，踏实做事 让健康的饮食与所选的食材有必然的关联， 我们愿用真诚来换取您的认可！！！'
	}];

	res.render('home', {
		title: 'DH FWD MENU',
		home_id: home_id,
		restaurants: restaurants,
		data: JSON.stringify(restaurants)
	});
});

router.get('/stay/:id', function(req, res) {
	console.log(req.params.id);
	res.render('index', {
		title: 'DH FWD MENU'
	});
});

router.get('/help/:help', function(req, res) {
	var help = 'help/' + req.params.help;
	console.log(help)
	res.render(help, {
		title: 'DH FWD MENU'
	});
});

module.exports = router;