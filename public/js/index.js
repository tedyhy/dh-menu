define('index', function(require, exports){
    var Class = require('core/lang/class');

    var Base = require('core/lang/base');

    var Index = Base.create({
        init : function(){
            console.log(11);
        }
    })

    Class.mixin(exports, {
        init : function(){
            new Index();
        }
    })
});

seajs.use('index', function(exports){
    exports.init();
});