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
	    defaults : {
	    	id: 0,
	        name : '',
	        price : 0,
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

		},

		render: function(id, todo) {
			if (!id && !todo) return;
		
			var $cartnum = this.$('#' + id + '-cart-num'),
				num = +$cartnum.text();

			num = !isNaN(num) && num || 0;

			num = todo === '+' ? ++num : --num ;

			if (num > 0) {
				$cartnum.text(num).show();
			} else {
				$cartnum.hide();
			}
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
				left = offset.left - this.$('.j-foodtype-nav').outerWidth(true) / 2 - 32;

			this.$('.j-foodtype-nav').removeClass('hidden').css({
				top: top,
				left: left
			});
		},

		fnHideClassic: function() {
			this.$('.j-foodtype-nav').addClass('hidden');
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

			this.render(fid, '+');
			// cartviews.render(fid, '+');

			var d = allfoods.get(fid);
			if (!d) return;
			
			carts.add(d.attributes);
		}

	});

	var ItemView = Backbone.View.extend({

		tagName: "li",

		className: 'clearfix',

		template: _.template($('#cartfood-template').html()),

		events: {
			"click .toggle": "toggleDone",
			"dblclick .view": "edit",
			"click a.destroy": "clear",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close"
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'remove', this.remove);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
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
			if (this.$('.j-cartul').children().length) {
				this.fnShoppingCart();
			};

			this.listenTo(carts, 'add', this.addOne);
			// this.listenTo(carts, 'reset', this.addAll);
			// this.listenTo(carts, 'all', this.render);
		},

		addOne: function(f){
			var view = new ItemView({
				model: f
			});

			// 调整高度
			var $orderlist = this.$('.j-order-list'),
				orderh = $orderlist.outerHeight(true);

			this.$(".j-cartul").append(view.render().el);
			$orderlist.stop().animate({'top': -(50 + orderh)});
		},

		render: function(id, todo) {
			// var d = allfoods.get(id);
			// if (!d) return;
			
			// carttpl = this.carttpl(d.attributes);

			// if (carttpl) {
			// 	var $orderlist = this.$('.j-order-list'),
			// 		orderh = $orderlist.outerHeight(true);

			// 	this.$('.j-cartul').append($(carttpl));
			// 	$orderlist.stop().animate({'top': -(50 + orderh)});
			// };
		},

		fnShoppingCart: function() {
			if (!this.$('.j-cartul').children().length) return;

			var $orderlist = this.$('.j-order-list'),
				h = 0 - $orderlist.outerHeight(true);

			if (+$orderlist.css('top').replace('px', '') === 0) {
				$orderlist.stop().animate({
					'top': h + 'px'
				});
			} else {
				$orderlist.stop().animate({
					'top': 0
				});
			}
		},

		fnClearCart: function() {
			// this.$('.j-cartul').children().remove();
			// this.$('.j-order-list').css('top', 0);
			carts.remove(carts.models);
			this.$('.j-order-list').css('top', 0);
			return false;
		}
	});

	var foodviews = new FoodView;
	var cartviews = new CartView;
});