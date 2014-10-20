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
			console.log(carts.models)
		}
	});

	var cartviews = new CartView;
});