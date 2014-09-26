/**
 * components event
 * @abstract
 */
define('core/lang/events', function(require, exports) {
	"use strict";

	var Class = require('core/lang/class');

	var eventMap = {};
	var Disposable = Class.Disposable;

	var Event = Class.create({
		_propagationStopped: false,

		_defaultPrevented: false,

		stopPropagation: function() {
			this._propagationStopped = true;
		},

		preventDefault: function() {
			this._defaultPrevented = true;
		},

		isStopPropagation: function() {
			return this._propagationStopped;
		},

		isPreventDefault: function() {
			return this._defaultPrevented;
		}

	}, Disposable, function(type, data) {
		this.eventType = type;
		this.eventData = data;
		Disposable.call(this);
	});

	/**
	 * 事件类, 继承这个类后拥有管理事件的能力
	 * @see compoment.js
	 */
	var EventTarget = Class.create({
		/**
		 * 获取事件监听器列表
		 * @param  {string}  type 事件类型
		 * @param  {boolean} isCreate 是否需要创建
		 * @private
		 * @return {array}
		 */
		_getEventList: function(type, isCreate) {
			if (!type) {
				return;
			}

			var uid = this._getUid();
			var eventObj = eventMap[uid];
			var eventList;

			type = type.toLowerCase();

			if (!eventObj) {
				if (isCreate) {
					eventObj = eventMap[uid] = {};
					eventList = eventObj[type] = [];
				}
			} else {
				eventList = eventObj[type];
				if (!eventList && isCreate) {
					eventList = eventObj[type] = [];
				}
			}

			return eventList;
		},

		/**
		 * 绑定事件
		 * @param  {string} type 事件类型
		 * @param  {function} handler 监听函数
		 * @return {string} 监听函数标识，可用于 Unbind
		 */
		bindEvent: function(type, handler) {
			var eventList = this._getEventList(type, true);

			if (!handler) {
				return;
			}

			eventList.push(handler);
			var key = eventList.length - 1;
			handler['_key'] = key;
			return key;
		},

		/**
		 * 解除事件绑定
		 * @param  {string} type 事件类型
		 * @param  {function|string} handler 或 key
		 */
		unbindEvent: function(type, handler) {
			var eventList = this._getEventList(type);

			if (!eventList) {
				return;
			}

			// clear all
			if (handler === void 0) {
				eventList.length = 0;
			} else {
				for (var i = 0; i < eventList.length; i++) {
					var _handler = eventList[i];
					if (_handler && (_handler == handler || _handler['_key'] == handler)) {
						eventList.splice(i, 1);
						i--;
					}
				}
			}

		},

		/**
		 * 派发事件
		 * @param  {string} type 事件类型
		 * @param  {object} data 数据对象
		 */
		dispatchEvent: function(type, data) {
			var eventList = this._getEventList(type);

			if (!eventList) {
				return;
			}

			var event = new Event(type, data);
			Class.forEach(eventList, function(handler) {
				if (handler.call(this, event) === false || event.isPreventDefault()) {
					return false;
				}
			}, this);

			// 向上一级冒泡
			if (this._parentEvent && !event.isStopPropagation()) {
				this._parentEvent.dispatchEvent(type, data);
			}
		},

		/**
		 * 设置上级事件对象
		 * @param {event} 事件对象
		 * @see dispatchEvent
		 */
		setParentEvent: function(parent) {
			this._parentEvent = parent;
		},
		/**
		 * 移除上级事件对象
		 */
		removeParentEvent: function() {
			this._parentEvent = null;
		}

	});

	Class.mixin(exports, {
		eventMap: eventMap,

		Event: Event,

		EventTarget: EventTarget,

		/** 
		 * 事件节流
		 * @param  {function} fn    监听函数
		 * @param  {number}   delay 间隔时间
		 * @return {function}       节流器
		 */
		throttle: function(fn, delay) {
			var delay = delay || 100;
			var last_exec = 0;
			var timeId;

			function wrap() {
				var that = this;
				var args = Class.arraySlice(arguments);
				var now = +new Date();
				var duration = now - last_exec;

				last_exec = now;

				function tick() {
					fn.apply(that, args);
					timeId = null;
				};

				timeId && clearTimeout(timeId);
				if (duration > delay) {
					tick();
				} else {
					timeId = setTimeout(tick, delay);
				}
			}

			Class.forEach(fn, function(value, name) {
				wrap[name] = value;
			});

			return wrap;
		}
	});

});