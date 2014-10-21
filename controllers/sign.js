var gtitle = 'DH FWD MENU';
var Thenjs = require('thenjs');

var check = require('validator').check;
var sanitize = require('validator').sanitize;

var crypto = require('crypto');
var config = require('../config.default');

var User = require('../models/user');

var auth = require('../middlewares/auth');

var utils = require('../common/utils');

//sign up
exports.showSignup = function(req, res, next) {
	res.render('register', {
		title: gtitle,
		error: "",
		name: "",
		loginname: ""
	});
};

exports.signup = function(req, res, next) {
	var name = sanitize(req.body.name).trim();
	name = sanitize(name).xss();
	var pass = sanitize(req.body.pass).trim();
	pass = sanitize(pass).xss();
	var re_pass = sanitize(req.body.re_pass).trim();
	re_pass = sanitize(re_pass).xss();

	if (name === '' || pass === '' || re_pass === '') {
		return res.render('register', {
			title: gtitle,
			error: '注册信息不完整。',
			name: name,
			loginname: ""
		});
	}

	if (name.length < 5) {
		return res.render('register', {
			title: gtitle,
			error: '用户名至少需要5个字符。',
			name: name,
			loginname: ""
		});
	}

	try {
		check(name, '用户名只能使用0-9，a-z，A-Z。').isAlphanumeric();
	} catch (e) {
		return res.render('register', {
			title: gtitle,
			error: e.message,
			name: name,
			loginname: ""
		});
	}

	if (pass !== re_pass) {
		return res.render('register', {
			title: gtitle,
			error: '两次密码输入不一致。',
			name: name,
			loginname: ""
		});
	}

	// 验证用户唯一性
	Thenjs(function(cont) {
		var obj = {
			name: name,
			callback: cont
		};
		User.getUsers(obj);
	}).
	then(function(cont, users) {
		if (users.length) {
			res.render('register', {
				title: gtitle,
				error: '用户名已被使用。',
				name: name,
				loginname: ""
			});
		} else {
			cont();
		};
	}).
	then(function(cont) {
		// md5 the pass
		pass = utils.md5(pass);
		// obj
		var obj = {
			name: name,
			pass: pass,
			callback: cont
		};
		// new user
		User.newAndSave(obj);
	}).
	then(function(cont, users) {
		users.length && gen_session(users[0], req, res);
		return res.redirect('/login');
		cont();
	}).
	fail(function(cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
		console.log(error);
		res.status(404);
		next(error);
	});
};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
exports.showLogin = function(req, res, next) {
	if (req.session.user) {
		return res.redirect('/home/1');
	};

	res.render('login', {
		title: gtitle,
		error: "",
		name: "",
		loginname: ""
	});
};

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
	'/active_account', //active page
	'/reset_pass', //reset password page, avoid to reset twice
	'/register', //regist page
	'/search_pass' //serch pass page
];

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function(req, res, next) {
	if (req.session.user || res.locals.current_user) {
		return res.redirect('/home/1');
	};

	var loginname = sanitize(req.body.name).trim();
	var pass = sanitize(req.body.pass).trim();

	if (!loginname || !pass) {
		res.render('login', {
			title: gtitle,
			error: '信息不完整。',
			name: loginname,
			loginname: ""
		});
		return;
	}

	// 验证用户
	Thenjs(function(cont) {
		var obj = {
			name: loginname,
			callback: cont
		};
		User.getUsers(obj);
	}).
	then(function(cont, users) {
		if (!users.length) {
			res.render('login', {
				title: gtitle,
				error: '这个用户不存在。',
				name: loginname,
				loginname: ""
			});
			cont('这个用户不存在。');
			return;
		};
		var user = users[0];
		pass = utils.md5(pass);
		if (pass !== user.pass) {
			res.render('login', {
				title: gtitle,
				error: '密码错误。',
				name: loginname,
				loginname: ""
			});
			cont('密码错误。');
			return;
		}
		// store session cookie
		gen_session(user, req, res);
		return res.redirect('/home/1');
		cont();
	}).
	fail(function(cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
		console.log(error);
		res.status(404);
		next(error);
	});
};

// sign out
exports.signout = function(req, res, next) {
	req.session.destroy();
	res.clearCookie(config.auth_cookie_name, {
		path: '/'
	});
	return res.redirect('/login');
};

exports.active_account = function(req, res, next) {
	var key = req.query.key;
	var name = req.query.name;

	User.getUserByName(name, function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user || utils.md5(user.email + config.session_secret) !== key) {
			return res.render('notify/notify', {
				error: '信息有误，帐号无法被激活。'
			});
		}
		if (user.active) {
			return res.render('notify/notify', {
				error: '帐号已经是激活状态。'
			});
		}
		user.active = true;
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.render('notify/notify', {
				success: '帐号已被激活，请登录'
			});
		});
	});
};

exports.showSearchPass = function(req, res) {
	res.render('sign/search_pass');
};

exports.updateSearchPass = function(req, res, next) {
	var email = req.body.email;
	email = email.toLowerCase();

	try {
		check(email, '不正确的电子邮箱。').isEmail();
	} catch (e) {
		res.render('sign/search_pass', {
			error: e.message,
			email: email
		});
		return;
	}

	// 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
	var retrieveKey = randomString(15);
	var retrieveTime = new Date().getTime();
	User.getUserByMail(email, function(err, user) {
		if (!user) {
			res.render('sign/search_pass', {
				error: '没有这个电子邮箱。',
				email: email
			});
			return;
		}
		user.retrieve_key = retrieveKey;
		user.retrieve_time = retrieveTime;
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			// 发送重置密码邮件
			mail.sendResetPassMail(email, retrieveKey, user.name);
			res.render('notify/notify', {
				success: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'
			});
		});
	});
};

/**
 * reset password
 * 'get' to show the page, 'post' to reset password
 * after reset password, retrieve_key&time will be destroy
 * @param  {http.req}   req
 * @param  {http.res}   res
 * @param  {Function} next
 */
exports.reset_pass = function(req, res, next) {
	var key = req.query.key;
	var name = req.query.name;
	User.getUserByQuery(name, key, function(err, user) {
		if (!user) {
			return res.render('notify/notify', {
				error: '信息有误，密码无法重置。'
			});
		}
		var now = new Date().getTime();
		var oneDay = 1000 * 60 * 60 * 24;
		if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
			return res.render('notify/notify', {
				error: '该链接已过期，请重新申请。'
			});
		}
		return res.render('sign/reset', {
			name: name,
			key: key
		});
	});
};

exports.update_pass = function(req, res, next) {
	var psw = req.body.psw || '';
	var repsw = req.body.repsw || '';
	var key = req.body.key || '';
	var name = req.body.name || '';
	if (psw !== repsw) {
		return res.render('sign/reset', {
			name: name,
			key: key,
			error: '两次密码输入不一致。'
		});
	}
	User.getUserByQuery(name, key, function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.render('notify/notify', {
				error: '错误的激活链接'
			});
		}
		user.pass = utils.md5(psw);
		user.retrieve_key = null;
		user.retrieve_time = null;
		user.active = true; // 用户激活
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			return res.render('notify/notify', {
				success: '你的密码已重置。'
			});
		});
	});
};

function getAvatarURL(user) {
	if (user.avatar_url) {
		return user.avatar_url;
	}
	var avatar_url = user.profile_image_url || user.avatar;
	if (!avatar_url) {
		avatar_url = config.site_static_host + '/public/images/user_icon&48.png';
	}
	return avatar_url;
}

// auth_user middleware
exports.auth_user = function(req, res, next) {
	if (req.session.user) {
		if (config.admins[req.session.user.name]) {
			req.session.user.is_admin = true;
		}
		res.locals.current_user = req.session.user;

	} else {
		var cookie = req.cookies[config.auth_cookie_name];

		if (!cookie) {
			return next();
		}

		var auth_token = utils.decrypt(cookie, config.session_secret);
		var auth = auth_token.split('\t');
		var user_id = auth[0];

		// 验证用户
		Thenjs(function(cont) {
			var obj = {
				id: user_id,
				callback: cont
			};
			User.getUserById(obj);
		}).
		then(function(cont, users) {
			var user = users[0];
			if (user) {
				if (config.admins[user.name]) {
					user.is_admin = true;
				}

				req.session.user = user;
				res.locals.current_user = req.session.user;
			}

			cont();
		}).
		fail(function(cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
			console.log(error);
			res.status(404);
			next(error);
		});
	};

	next();
};

// private
function gen_session(user, req, res) {
	var auth_token = utils.encrypt(user.id + '\t' + user.name + '\t' + user.pass, config.session_secret);
	//cookie 有效期30天
	res.cookie(config.auth_cookie_name, auth_token, {
		path: '/',
		maxAge: 1000 * 60 * 60 * 24 * 30
	});
	if (config.admins[user.name]) {
		user.is_admin = true;
	}

	req.session.user = user;
	res.locals.current_user = req.session.user;
};