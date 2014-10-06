var express = require('express');
var router = express.Router();

var restaurantConn = require('../data/order')

/* 参数过滤 */
router.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val){
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
        id = req.params.id,
        ip = req.ip,
        obj = {}
        ;

    if(id){
        obj.id = id;
        obj.callback = function(result){
            res.render('restaurant', {
                id : id,
                ip : ip,
                mname : result.mname,
                mphone : result.mphone,
                peoplenum : result.peoplenum,
                addtime : result.addtime,
                order : global.cache.order[id],
                menu : result.menu
            });
        }
        restaurantConn.getone(obj, res, next);        
    }
});

module.exports = router;