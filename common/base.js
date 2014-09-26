module.exports = (function(){
    return {
        extend : function(o, n){
            var target = {};
            for(var item in o){
                target[item] = o[item];
            }
            if(n && typeof n === 'object'){
                for(var item in n){
                    target[item] = n[item];
                }
            }
            return target;
        }
    }
})();