/**
 * Base
 * @author liujiankang@dhgate.com
 * @create 2013-12-10
 * @update 2014-05-21
 */
(function(){

    var root = window.DH || (window.DH = {});

    root.domain = 'dhgate.com';

    root.Widget = {};

    var _spliter = /^(\S+)\s*(.*)$/;

    var _hasprop = Object.prototype.hasOwnProperty;

    var _slice = Array.prototype.slice;

    var _concat = Array.prototype.concat;

    var _getType = function(o){
        return Object.prototype.toString.call(o);
    }

    var _isFunction = function(o){
        return _getType(o) === '[object Function]';
    }

    var _isObject = function(o){
        return _getType(o) === '[object Object]';
    }

    var _isArray = function(o){
        return _getType(o) === '[object Array]';
    }

    var _isString = function(o){
        return _getType(o) === '[object String]';
    }

    var Base = {
        bind : function(ev, callback){
            this.ev[ev] = callback;
            return this;
        },
        unbind : function(ev){
            this.ev[ev] && (delete this.ev[ev]);
            return this;
        },
        trigger : function(ev){
            var rtn = true;
            if(this.ev[ev]){
                rtn = this.ev[ev].apply(this, _slice.call(arguments, 1));
            }
            return rtn;
        },
        /**
         * 事件代理
         */
        proxy : function(){
            if(arguments.length === 0) return;

            var args = arguments,
                fn = args[0],
                context = args.length === 1 ? this : (_isObject(args[1]) && args[1]);

            return function(){
                return fn.apply(context, args.length > 2 ? _concat.call(_slice.call(args, 2), _slice.call(arguments)) : arguments);
            }
        },
        _supper : function(options){
            this.options = options = options || {};

            this.el = this.el || options.el;

            this.el = this.el && (_isString(this.el) ? $(this.el) : this.el) || $(document);

            options.el && delete options.el;

            this.ev = {};

            this._bind();
        },
        /**
         * 缓存节点&绑定初始事件
         */
        _bind : function(){
            this.elements && ~function(self){
                for(var item in self.elements){
                    _hasprop.call(self.elements, item) && (self[self.elements[item]] = self.el.find(item));
                }
            }(this);

            this.events && ~function(self){
                for(var item in self.events){                   
                    _hasprop.call(self.events, item) && 
                    ~function(){
                        var items = _spliter.exec(item),
                            type = items[1],
                            selector = items[2],
                            method = _isFunction(self.events[item]) ? self.events[item] : self[self.events[item]]
                            ;

                        if(method){
                            method = self.proxy(method);
                            if(selector){
                                self.el.delegate(selector, type, method);
                            }else{
                                self.el.bind(type, method);
                            }
                        }
                    }();
                }
            }(this);
        },
        _create : function(){
            function f(){};
            f.prototype = this;
            return new f;
        },
        /**
         * 类模式
         */
        create : function(extend){
            var Result;

            Result = function(){
                Base._supper.apply(this, arguments);
                this.init && _isFunction(this.init) && this.init.apply(this, arguments);
            };

            $.extend(Result.prototype, this._create());

            extend && _isObject(extend) && $.extend(Result.prototype, extend);

            return Result;
        },
        /**
         * 单例模式
         */
        single : function(extend){
            var Result;

            Result = this._create();

            extend && _isObject(extend) && $.extend(Result, extend);

            this._supper.apply(Result, _slice.call(arguments, 1));

            Result.init && _isFunction(Result.init) && Result.init.apply(Result, _slice.call(arguments, 1));;

            return Result;
        },
        /**
         * 模板操作
         */
        tmpl : (function(){
            var cache = {};
 
            function tmpl(str, data){
                // fixed data undefined property
                str.replace(/<%=([\s\S]+?)%>/g, function(m, n){
                  !data[n] && (data[n] = '');
                });
                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                var fn = !/\W/.test(str) ?
                  cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :
                 
                  // Generate a reusable function that will serve as a template
                  // generator (and which will be cached).
                  new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                   
                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +
                   
                    // Convert the template into pure JavaScript
                    str
                      .replace(/[\r\t\n]/g, " ")
                      .split("<%").join("\t")
                      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                      .replace(/\t=(.*?)%>/g, "',$1,'")
                      .split("\t").join("');")
                      .split("%>").join("p.push('")
                      .split("\r").join("\\'")
                  + "');}return p.join('');");

                // Provide some basic currying to the user
                return data ? fn( data ) : fn;
            };

            return tmpl;
        })()
    };

    if(typeof module !== 'undefined' && module.exports){
        module.exports = Base;
    }else if(typeof define === 'function'){
        define('core/lang/base', function() {
            return Base;
        });
    }else{
        root.Base = Base;
    }

})();