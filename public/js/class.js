/**
 * oop机制实现
 * @abstract
 */
define('core/lang/class', function(require, exports, moudle) {
	"use strict";

	var uidProperty = 'UIDPROPERTY';
	var uidCounter = 0;
	var instances = {};

	var classType = {
		'[object Array]': 'array',
		'[object Boolean]': 'boolean',
		'[object Object]': 'object',
		'[object Fcuntion]': 'function',
		'[object String]': 'string',
		'[object Date]': 'date',
		'[object RegExp]': 'regExp',
		'[object Error]': 'error',
		'[object Undefined]': 'undefined',
		'[object Null]': 'null'
	};

	var getUid = function(obj) {
		return obj[uidProperty] || (obj[uidProperty] = '_classid_' + (++uidCounter));
	};

	var uncurryThis = function(f) {
		return function() {
			return Function.call.apply(f, arguments);
		};
	};

	var arraySlice = uncurryThis(Array.prototype.slice);

	var toString = uncurryThis(Object.prototype.toString);

	var noop = function() {};


	var typeOf = function(obj) {
		return classType[toString(obj)];
	};

	/**
	 * 遍历集合
	 * @param  {array|object} collection
	 * @param  {function} iterator
	 */
	var forEach = function(collection, iterator, context) {
		var context = context || collection;

		if (typeOf(collection) == 'object') {
			for (var key in collection) {
				if (collection.hasOwnProperty(key) && iterator.call(context, collection[key], key) === false) {
					return;
				}
			}
		} else if (typeOf(collection) == 'array') {
			for (var i = 0; i < collection.length; i++) {
				if (iterator.call(context, collection[i], i) === false) {
					return;
				}
			}
		}
	};

	/**
	 * 继承
	 * @method inherit
	 * @param {function} sub
	 * @param {function} sup
	 * @param {object} px 原型属性
	 * @param {object} sx 静态属性
	 */
	var inherit = function(sub, sup, px, sx) {
		var temp = function() {};
		temp.prototype = sup.prototype;
		var sp = sub.prototype = new temp();
		sub.prototype.constructor = sub;

		if (px) {
			mixin(sp, px, true);
		}

		if (sx) {
			mixin(sub, sx, true);
		}

		return sub;
	};

	/**
	 * 混合
	 * @method inherit
	 * @param {function|object} receiver
	 * @param {function|object} supplier
	 * @param {boolean} overwrite 是否覆盖同名
	 * @param {array} whitelist
	 */
	var mixin = function(receiver, supplier, overwrite, whitelist) {
		if (!receiver || !supplier) {
			return (receiver || supplier);
		}

		forEach(supplier, function(value, key) {
			if (overwrite || receiver[key] === void 0) {
				receiver[key] = value;
			}
		});

		if (whitelist) {
			forEach(whitelist, function(key) {
				receiver[key] = supplier[key];
			});
		}

		return receiver;
	};

	/**
	 * 创建类
	 * @method createClass
	 * @param {object} px 原型属性
	 * @param {function} sup 父类
	 * @param {function} ctor 构造函数
	 * @param {object} sx 静态属性
	 */
	var create = function(px, sup, ctor, sx) {
		if (!sup) {
			sup = Disposable;
		}

		var klass = function() {
			(ctor || sup).apply(this, arraySlice(arguments));
		};

		return inherit(klass, sup, px, sx);
	};

	/** 所有 class 的基类 */
	var Disposable = create({
		_getUid: function() {
			return this[uidProperty];
		},

		isDisposed: function() {
			return this._disposed;
		},

		/** to be overrode */
		disposeInternal: function() {},

		dispose: function() {
			if (!this.isDisposed()) {
				this._disposed = true;
				this.disposeInternal();
				delete instances[this._getUid()];
			}
		}

	}, noop, function() {
		instances[getUid(this)] = this;
		this._disposed = false;

	}, {
		getUndisposedObjects: function() {
			var ret = [];
			forEach(instances, function(instance) {
				ret.push(instance);
			});
			return ret;
		},

		clearUndisposedObjects: function() {
			instances = {};
		}
	});

	mixin(exports, {
		/**
		 * 抽象方法
		 */
		abstractMethod: function() {
			throw Error('unimplemented abstract method');
		},

		/**
		 * 判断目标对象是否在数组中
		 * @param  {array} collection
		 * @param  {object} target
		 */
		arrayExsit: function(collection, target, compare) {
			var index = -1;

			forEach(collection, function(obj, i) {
				if (obj == target) {
					index = i;
					return false;
				}
			});

			return index;
		},

		/**
		 * context 代理而已
		 * @param  {function} fn
		 * @param  {object}   context
		 */
		curryThis: function(fn, context) {
			return function() {
				return fn.apply(context, arraySlice(arguments));
			}
		},

		typeOf: typeOf,

		forEach: forEach,

		Disposable: Disposable,

		arraySlice: arraySlice,

		noop: noop,

		inherit: inherit,

		mixin: mixin,

		create: create
	});

	forEach(['isObject', 'isString', 'isArray', 'isFunction', 'isUndefined', 'isNull'], function(key) {
		exports[key] = function(obj) {
			return (typeOf(obj) == key.replace('is', '').toLowerCase());
		};
	});

});