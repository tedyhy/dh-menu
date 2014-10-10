define('apps/restaurant/restaurant', function(require, exports) {
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		foodData = eval("(" + $('.j-food-data').val() + ")");

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
		$broadcaster = $('.j-broadcaster'),
		$widgets = $('.j-widgets');
	$(window).scroll(function() {
		var top = $(window).scrollTop();
		if (top < foodListOffset.top && $broadcaster.hasClass('broadcaster-fixed')) {
			$broadcaster.removeClass('broadcaster-fixed');
			$widgets.css('padding-top', 0);
		} else if (top >= foodListOffset.top && !$broadcaster.hasClass('broadcaster-fixed')) {
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
		},

		render: function(d){
			var id = d.get('id'),
				$cartnum = this.$('#' + id + '-cart-num'),
				cart = d.get('cart');

			if (cart <=0 ) {
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
			var $self = $(e.currentTarget),
				fid = $self.attr('id');

			var d = allfoods.get(fid);
			if (!d) return;

			var cart = d.get('cart');
			d.set('cart', cart + 1);

			if (carts.get(fid)) {
				carts.set(d);
			} else {
				carts.add(d);
			}
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
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		minusOne: function() {
			var v = +this.$txtcount.val();
			console.log(v)
			v = !isNaN(v) ? v : 0;
			v -= 1;

			this.$txtcount.val(v);
		},

		clear: function() {
			this.model.destroy();
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

			if (carts.models.length) {
				this.fnShoppingCart();
			};

			this.listenTo(carts, 'add', this.addOne);
			this.listenTo(carts, 'remove', this.removeOne);
			this.listenTo(carts, 'all', this.render);
			this.listenTo(carts, 'change', this.addAll);
			
		},

		addAll: function(d) {
			console.log(d.models)
			carts.remove(d.models);
			carts.add(d)
			// d.each(this.addOne, this);
		},

		addOne: function(f) {
			var view = new ItemView({
				model: f
			});

			// 调整高度
			var orderh = this.$orderlist.outerHeight(true);

			this.$cartul.append(view.render().el);
			this.$orderlist.stop().animate({
				'top': -(50 + orderh)
			});
		},

		removeOne: function() {
			// 调整高度
			var orderh = this.$orderlist.outerHeight(true);

			this.$orderlist.stop().animate({
				'top': -(orderh - 50)
			});
		},

		render: function() {
			this.renderPay(carts.models.length);
		},

		renderPay: function(l) {
			if (l) {
				this.$('.j-readypay').hide();
				this.$('.j-gopay').show();
				return;
			};
			this.$('.j-readypay').show();
			this.$('.j-gopay').hide();
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
			carts.remove(carts.models);
			return false;
		}
	});

	var foodviews = new FoodView;
	var cartviews = new CartView;
});