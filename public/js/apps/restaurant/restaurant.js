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
	$('.text-food').hover(function(){
		$(this).addClass('over');
	}, function(){
		$(this).removeClass('over');
	});

	// 订餐必读&商家公告
	var foodListOffset = $('.j-food-list').offset(),
		$broadcaster = $('.j-broadcaster'),
		$widgets = $('.j-widgets');
	$(window).scroll(function(){
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

	$(window).scroll(function(){
		var top = $(window).scrollTop();
		if (top < foodListOffset.top) {
			$titleblank.addClass('hidden');
		} else if (top >= foodListOffset.top) {
			$titleblank.removeClass('hidden');

			$categorys.each(function(i, cate){
				var t = $(cate).offset().top;
				if (top >= t) {
					var title = $(cate).find('.tag-na').text();
					$titleblank.find('.tag-na').text(title);
				};
			});
		}
	});

	// mvc
	var Food = Backbone.Model.extend({
		defaults: {}
	});

	var FoodList = Backbone.Collection.extend({
		model: Food
	});

	var allfoods = new FoodList(foodData);

	var FoodView = Backbone.View.extend({
		el: $(".j-food-list"),

		events: {
			'click .j-food-cate': 'fnScrollToCate',
			'mouseenter .j-title-blank .classic': 'fnShowClassic',
			'mouseleave .j-foodtype-nav': 'fnHideClassic',
			'mouseenter .j-title-blank a': 'fnAAddOver',
			'mouseleave .j-title-blank a': 'fnARemoveOver',
			'click .j-text-food': 'fnAddFoodToCart'
		},

		initialize: function() {
			
		},

		fnScrollToCate: function(e){
			var $self = $(e.target),
				$li = $self.parents('li'),
				anchor = +$self.parent().attr('data-anchor') || 0,
				top = $categorys.eq(anchor).offset().top;

			$li.addClass('active').siblings().removeClass('active');
			$('html, body').animate({'scrollTop': top+'px'});
		},

		fnShowClassic: function(e){
			var offset = $(e.target).offset(),
				top = offset.top + 40,
				left = offset.left - $('.j-foodtype-nav').outerWidth(true)/2 - 32;

			$('.j-foodtype-nav').removeClass('hidden').css({top: top, left: left});
		},

		fnHideClassic: function(){
			$('.j-foodtype-nav').addClass('hidden');
		},

		fnAAddOver: function(e){
			$(e.target).addClass('over');
		},

		fnARemoveOver: function(e){
			$(e.target).removeClass('over');
		},

		fnAddFoodToCart: function(){

		}

	});

	var CartView = Backbone.View.extend({
		el: $(".j-shopping-cart"),

		statsTemplate: _.template($('#foodcontext-template').html()),

		events: {
			'click .j-shopping-cart-footer': 'fnShoppingCart'
		},

		initialize: function() {
			// console.log(this.statsTemplate)

		},
		fnShoppingCart: function(){
			var $orderlist = $('.j-order-list');
			if (+$orderlist.css('top').replace('px', '') === 0) {
				$orderlist.stop().animate({'top': '-275px'});
			} else {
				$orderlist.stop().animate({'top': 0});
			}
		}
	});

	new FoodView;
	new CartView;
});