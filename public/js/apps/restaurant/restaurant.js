define('apps/restaurant/restaurant', function(require, exports) {
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		TWEEN = require('libs/tween/Tween'),
		foodData = eval("(" + $('.j-food-data').val() + ")"),
		cartData = eval("(" + $('.j-cart-data').val() + ")")
		socket = io.connect();

	// animate
	require("libs/tween/requestAnimationFrame");

	// 设置underscore模板边界符号
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	// details
	$('.j-details').hover(function() {
		$(this).addClass('over');
	}, function() {
		$(this).removeClass('over');
	});
	$('.text-food').hover(function() {
		$(this).addClass('over');
	}, function() {
		$(this).removeClass('over');
	});

	// 订餐必读&商家公告
	var foodListOffset = $('.j-food-list').offset(),
		ori_foodtype_nav_h = $('.ori-foodtype-nav').outerHeight(true),
		$broadcaster = $('.j-broadcaster'),
		$widgets = $('.j-widgets');
	$(window).scroll(function() {
		var top = $(window).scrollTop();
		if (top < (foodListOffset.top - ori_foodtype_nav_h) && $broadcaster.hasClass('broadcaster-fixed')) {
			$broadcaster.removeClass('broadcaster-fixed');
			$widgets.css('padding-top', 0);
		} else if (top >= (foodListOffset.top - ori_foodtype_nav_h) && !$broadcaster.hasClass('broadcaster-fixed')) {
			$broadcaster.addClass('broadcaster-fixed');
			$widgets.css('padding-top', '161px');
		}
	});

	// foods滚动title
	var $categorys = $('.j-food-nav .category'),
		foodListOffset = $categorys.eq(0).offset(),
		$titleblank = $('.j-title-blank');

	$categorys.eq(0).find('.actions a').hover(function() {
		$(this).addClass('over');
	}, function() {
		$(this).removeClass('over');
	});
	$(window).scroll(function() {
		var top = $(window).scrollTop();
		if (top < foodListOffset.top) {
			$titleblank.addClass('hidden');
			$('.j-foodtype-nav').addClass('hidden');
		} else if (top >= foodListOffset.top) {
			$titleblank.removeClass('hidden');

			$categorys.each(function(i, cate) {
				var t = $(cate).offset().top;
				if (top >= t) {
					var title = $(cate).find('.tag-na').text();
					$titleblank.find('.tag-na').text(title);
				};
			});
		}
	});

	// trigger scroll events
	window.onload = function() {
		$(window).trigger('scroll');
	}

	// mvc
	var foods = [];
	for (var i = 0, f = []; i < foodData.length; i++) {
		f = foodData[i].food;
		for (var j = 0; j < f.length; j++) {
			foods.push(f[j]);
		};
	};

	var Food = Backbone.Model.extend({
		defaults: {}
	});

	var Cart = Backbone.Model.extend({
		defaults: {
			id: 0,
			name: '',
			price: 0,
			num: 1
		}
	});
	var CartColl = Backbone.Collection.extend({
		model: Cart
	});

	var carts = new CartColl;


	var allfoods = new Backbone.Collection(foods, {
		model: Food
	});

	var FoodView = Backbone.View.extend({
		el: $(".j-food-list"),

		events: {
			'click .j-food-cate': 'fnScrollToCate',
			'mouseenter .j-title-blank .classic': 'fnShowClassic',
			'mouseleave .j-foodtype-nav': 'fnHideClassic',
			'mouseenter .j-title-blank a': 'fnAAddOver',
			'mouseleave .j-title-blank a': 'fnARemoveOver',
			'click .j-add-cart': 'fnAddFoodToCart'
		},

		initialize: function() {
			this.$foodtypenav = this.$('.j-foodtype-nav');

			this.listenTo(allfoods, 'change', this.render);

			// 广播内容
            // socket.on('client.menu.add', $.proxy(this.ioAddOne, this));
		},

		ioAddOne: function(f){
			allfoods.set(f);
		},

		render: function(d) {
			var id = d.get('id'),
				$cartnum = this.$('#' + id + '-cart-num'),
				cart = d.get('cart');

			if (cart <= 0) {
				$cartnum.hide();
				return;
			};
			$cartnum.text(cart).show();
		},

		fnScrollToCate: function(e) {
			var $li = $(e.currentTarget),
				$a = $li.find('a'),
				anchor = +$a.attr('data-anchor') || 0,
				top = $categorys.eq(anchor).offset().top;

			$li.addClass('active').siblings().removeClass('active');
			$('html, body').stop().animate({
				'scrollTop': top + 'px'
			});
		},

		fnShowClassic: function(e) {
			var offset = $(e.target).offset(),
				top = 50,
				left = offset.left - this.$foodtypenav.outerWidth(true) / 2 - 32;

			this.$foodtypenav.removeClass('hidden').css({
				top: top,
				left: left
			});
		},

		fnHideClassic: function() {
			this.$foodtypenav.addClass('hidden');
		},

		fnAAddOver: function(e) {
			$(e.target).addClass('over');
		},

		fnARemoveOver: function(e) {
			$(e.target).removeClass('over');
		},

		fnAddFoodToCart: function(e) {
			var self = this,
				$self = $(e.currentTarget),
				fid = $self.attr('id');

			var d = allfoods.get(fid);
			if (!d) return;

			var cart = d.get('cart'),
				price = d.get('price');
			
			// 添加购物车动画
			self.addFoodAnim($self, price, function() {
				d.set('cart', cart + 1);
				carts.add(d);
				// 缓存到服务器
				// socket.emit('server.menu.add', {uid: 111, data: d});
			});

			function animate(time){
				window.requestAnimationFrame(animate);
				TWEEN.update(time);
			}

			animate();
		},

		addFoodAnim: function($btn, price, fn) {
			var self = this,
				c, d, e, f = $(window).scrollTop(),
				$shoppingcart = cartviews.$(".i-shopping-cart"),
				cart_offset = $shoppingcart.offset(),
				$tip = $('<span class="rst-animate-tip">' + price + "</span>").appendTo('body'),
				btn_offset = $btn.offset(),
				m = $btn.width(),
				n = $btn.height();

			d = {
				left: btn_offset.left + m / 2 - $tip.outerWidth(!0) / 2,
				top: btn_offset.top - f + n / 2 - $tip.outerHeight(!0) / 2
			};
			e = {
				left: cart_offset.left + $shoppingcart.width() / 2 - $tip.outerWidth(!0) / 2,
				top: cart_offset.top - f
			};
			c = {
				x: e.left - d.left,
				y: e.top - d.top
			};

			new TWEEN.Tween({
				x: 0,
				y: 0,
				old: {
					x: 0,
					y: 0
				}
			}).to({
				x: [.6 * c.x, c.x],
				y: [Math.min(-150, c.y - 100), c.y]
			}, 700).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function() {
				$tip.css({
					left: this.x + d.left + "px",
					top: this.y + d.top + "px"
				});
				this.old.x = this.x;
				this.old.y = this.y;

			}).onComplete(function() {
				$tip.remove();
				typeof fn === 'function' && fn.call(self);
			}).start();
		}

	});

	var ItemView = Backbone.View.extend({

		tagName: "li",

		className: 'clearfix',

		template: _.template($('#cartfood-template').html()),

		events: {
			"click .j-minus": "minusOne",
			"click .j-plus": "plusOne"
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'remove', this.remove);

			// 广播内容
            // socket.on('client.menu.add', $.proxy(this.ioAddOne, this));
		},

		ioAddOne: function(f){
			this.model.set(f);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			// 总计
			cartviews.render();

			return this;
		},

		minusOne: function() {
			var cart = +this.model.get('cart') - 1;

			if (cart === 0) {
				this.clear();
				return;
			}
			this.model.set('cart', cart);
		},

		plusOne: function() {
			var cart = +this.model.get('cart') + 1;

			this.model.set('cart', cart);
		},

		clear: function() {
			carts.remove(this.model);
			allfoods.get(this.model.get('id')).set('cart', 0);
		}

	});

	var CartView = Backbone.View.extend({
		el: $(".j-shopping-cart"),

		carttpl: _.template($('#cartfood-template').html()),

		events: {
			'click .j-shopping-cart-footer': 'fnShoppingCart',
			'click .j-clearcart': 'fnClearCart'
		},

		initialize: function() {
			this.$cartul = this.$('.j-cartul');
			this.$orderlist = this.$('.j-order-list');
			this.$bill = this.$('.j-bill');
			this.$totalnumber = this.$('.j-totalnumber');
			this.$readypay = this.$('.j-readypay');
			this.$gopay = this.$('.j-gopay');

			if (carts.models.length) {
				this.fnShoppingCart();
			};

			this.listenTo(carts, 'add', this.addOne);
			this.listenTo(carts, 'remove', this.removeOne);
			this.listenTo(carts, 'all', this.render);

			// cartData && carts.set(cartData);

			// 广播内容
            // socket.on('client.menu.add', $.proxy(this.ioAddOne, this));
            // socket.on('client.menu.remove', $.proxy(this.removeMenu, this));
            // socket.on('client.menu.reset', $.proxy(this.resetMenu, this));
		},

		ioAddOne: function(f){
			carts.set(f);
		},

		addOne: function(f) {
			var view = new ItemView({
				model: f
			});

			// 调整高度
			var orderh = this.$orderlist.outerHeight(true);

			this.$cartul.prepend(view.render().el);

			if (orderh >= 400) {
				this.$cartul.scrollTop(0);
				return;
			}

			this.$orderlist.stop().animate({
				'top': -(50 + orderh)
			});
		},

		removeOne: function() {
			// 调整高度
			var orderh = this.$orderlist.outerHeight(true);

			this.$orderlist.stop().animate({
				'top': -orderh
			});
		},

		render: function() {
			var t = 0,
				n = 0;

			carts.each(function(p, i) {
				t += (+p.get('price') * +p.get('cart')); // 总计
				n += +p.get('cart'); // 份
			})

			this.$totalnumber.text(n);
			this.$bill.text('¥' + t);

			this.renderPay(carts.models.length);
		},

		renderPay: function(l) {
			if (l) {
				this.$readypay.hide();
				this.$gopay.show();
				return;
			};
			this.$readypay.show();
			this.$gopay.hide();
		},

		fnShoppingCart: function() {
			if (!carts.models.length) return;

			var h = 0 - this.$orderlist.outerHeight(true);

			if (+this.$orderlist.css('top').replace('px', '') === 0) {
				this.$orderlist.stop().animate({
					'top': h + 'px'
				});
			} else {
				this.$orderlist.stop().animate({
					'top': 0
				});
			}
		},

		fnClearCart: function() {
			this.$orderlist.css('top', 0);

			carts.each(function(d, i) {
				allfoods.get(d.get('id')).set('cart', 0);
			});

			carts.remove(carts.models);

			return false;
		}
	});

	var foodviews = new FoodView;
	var cartviews = new CartView;
});