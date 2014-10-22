define('apps/order/preview', function(require, exports) {
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		cartData = eval("(" + $('.j-cart-data').val() + ")");

	// 设置underscore模板边界符号
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	// mvc
	var Cart = Backbone.Model.extend({
		defaults: {}
	});
	var CartColl = Backbone.Collection.extend({
		model: Cart
	});

	var carts = new CartColl;

	var CartView = Backbone.View.extend({
		el: $(".j-order-confirm"),

		events: {
			'click #confirmOrder': 'fnConfirmOrder'
		},

		initialize: function() {
			this.$confirmOrder = this.$('#confirmOrder');
			this.$confirmOrder2 = this.$('#confirmOrder2');
			this.$totalPrice = this.$('#totalPrice');
			this.$tnumber = this.$('.j-t-number');

			this.listenTo(carts, 'all', this.render);

			cartData.length && carts.add(cartData, {
				merge: true
			}) || this.renderPay();
		},

		render: function() {
			var t = 0,
				n = 0;

			carts.each(function(p, i) {
				t += (+p.get('price') * +p.get('cart')); // 总计
				n += +p.get('cart'); // 份
			})

			this.$totalPrice.text(t);
			this.$tnumber.text('合计' + t + ' 元');

			this.renderPay(carts.models.length);
		},

		renderPay: function(l) {
			if (!l) {
				this.$confirmOrder.hide();
				return;
			};
			this.$confirmOrder.show();
		},

		fnConfirmOrder: function() {
			var self = this,
				order = carts.toJSON();

			this.showOrderBtn(false);

			$.post('/order/preview/api/saveorder', {
				order: order,
				_t: +new Date
			}, function(res) {
				if (res && res.code === 0) {
					alert('确认订单成功！');
				} else {
					alert('确认订单失败！');
				};
				
				self.showOrderBtn(true);
			}, 'json');
		},

		showOrderBtn: function(bool){
			if (bool) {
				this.$confirmOrder.show();
				this.$confirmOrder2.hide();
			} else {
				this.$confirmOrder.hide();
				this.$confirmOrder2.show();
			};
		}
	});

	var cartviews = new CartView;
});