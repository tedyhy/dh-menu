var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var _ = require('underscore');
var restaurantConn = require('../models/restaurant');
var orderConn = require('../models/order');
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
        _restinfo = {}, // 餐馆详细信息
        _data = [],
        _users = [];

    Thenjs(function(cont) {
        // 验证订餐发起人_fqadmin
        var obj = {
            name: _fqadmin,
            callback: cont
        };
        User.getUsers(obj); // 确定用户是否存在
    }).
    parallel([
        // 获取所有用户信息
        function(cont) {
            var obj = {
                callback: cont
            };
            User.getAllUsers(obj);
        },
        // 获取餐馆详细信息
        function(cont) {
            var obj = {
                id: _id,
                callback: cont
            };
            restaurantConn.getrest(obj);
        }
    ]).
    then(function(cont, result) {
        // console.log(result);
        var r;
        // 所有用户信息
        if (result[0]) {
            _users = result[0];
        } else {
            cont(new Error("no users info!!!"));
        };
        // 餐馆信息
        if (result[1]) {
            r = result[1];
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
        } else {
            cont(new Error("no restinfo info!!!"));
        };
        cont();
    }).
    then(function(cont) {
        // 获取在当前餐馆的所有订餐信息
        var obj = {
            name: _fqadmin,
            callback: cont
        };
        orderConn.getOrders(obj);
    }).
    then(function(cont, result) {
        var _date;
        if (result && result.length) {
            _data = result;
            result.forEach(function(d, i) {
                _date = new Date(d.datetime);
                _data[i].datetime = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
            });
        };
        cont();
    }).
    then(function(cont) {
        // 渲染页面
        res.render('bill', {
            id: _id,
            title: gtitle,
            is_admin: _isAdmin,
            restinfo: _restinfo,
            bill_data: _data,
            bill_list: JSON.stringify(_data),
            users: JSON.stringify(_users),
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
