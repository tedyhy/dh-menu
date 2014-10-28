define('apps/restaurant/restaurant', function(require, exports) {
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		TWEEN = require('libs/tween/Tween'),
		Search = require('modules/search/search'),
		foodData = eval("(" + $('.j-food-data').val() + ")"),
		cartData = eval("(" + $('.j-cart-data').val() + ")"),
		socket = io.connect(),
		CUSER = window.CUSER,
		fqadmin = window.FQUSER;

	// animate
	require("libs/tween/requestAnimationFrame");

	// 设置underscore模板边界符号
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

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
		$titleblank = $('.j-title-blank'),
		$foodtypenav = $('.j-foodtype-nav'),
		$orifoodtypenav = $('.ori-foodtype-nav');
	$categorys.eq(0).find('.actions a').hover(function() {
		$(this).addClass('over');
	}, function() {
		$(this).removeClass('over');
	});
	$(window).scroll(function() {
		var top = $(window).scrollTop();

		if (top < foodListOffset.top) {
			$titleblank.addClass('hidden');
			$foodtypenav.addClass('hidden');
			$('.j-search-list').css('position')==='fixed' && $('.j-search-list').hide();

		} else if (top >= foodListOffset.top) {
			$titleblank.removeClass('hidden');

			$categorys.each(function(i, cate) {
				var t = $(cate).offset().top;
				if (top >= t) {
					var title = $(cate).find('.tag-na').text();
					$titleblank.find('.tag-na').text(title);

					if ($('html, body').is(':animated')) return;

					$foodtypenav.find('li.j-food-cate').eq(i).addClass('active')
						.siblings().removeClass('active');
					$orifoodtypenav.find('li.j-food-cate').eq(i).addClass('active')
						.siblings().removeClass('active');
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

	var InfoView = Backbone.View.extend({
		el: $(".j-inner-wrap"),

		template: _.template($('#search-item-template').html()),

		events: {
			'mouseenter .j-details': 'fnShowDetails',
			'mouseleave .j-details': 'fnHideDetails'
		},

		initialize: function() {
			var self = this;

			new Search('.j-search-input', {
				data: foods,
				tpl: self.template
			});

			$('body').on('click', function() {
				$('.j-search-list').hide();
			});
		},

		fnShowDetails: function(e) {
			$(e.currentTarget).addClass('over');
		},

		fnHideDetails: function(e) {
			$(e.currentTarget).removeClass('over');
		},

		search: function(e) {
			var $list, $prev, $next,
				self = this,
				input = e.target,
				$searchinput = $(input),
				value = input.value,
				code = e.keyCode,
				tpl = this.template,
				re = new RegExp(value.replace(/\s/g, '')),
				count = 0,
				$list = ($list = $('.j-search-list'))[0] && $list || $('<ul class="search-list j-search-list" style="display: none;"></ul>').appendTo('body'),
				sioffset = $searchinput.offset(),
				siwidth = $searchinput.outerWidth(true),
				offset = {
					top: 0,
					left: 0
				};

			if ($.trim(value) === '') {
				$list.hide();
				return;
			}

			if (code === 38) { // 上箭头
				if ($list.is(':visible') && ($prev = this.$currentItem.prev('.j-search-item')).length) {
					$prev.addClass('over');
					this.$currentItem.removeClass('over');
					this.$currentItem = $prev;
				}
			} else if (code === 40) { // 下箭头
				if ($list.is(':visible') && ($next = this.$currentItem.next('.j-search-item')).length) {
					$next.addClass('over');
					this.$currentItem.removeClass('over');
					this.$currentItem = $next;
				}
			} else if ($list.is(':visible') && code === 13) { // 回车
				// this.selectSearchItem(this.$currentItem);
				console.log(13);
			} else {
				$list.hide().empty();

				$.each(foods, function(m, n) {
					if (re.test(n.name.replace(/\s/g, ''))) {
						$list.append(tpl({
							id: n.id,
							name: n.name,
							price: n.price
						}));
						count++;
					}
				});

				if (count > 0) {
					offset.top = sioffset.top + $searchinput.outerHeight(true) + 2;
					offset.left = sioffset.left;
					this.$currentItem = $list.children().eq(0);
					this.$currentItem.addClass('over');
					$list.css(offset).width(siwidth).show();
				}
			}

		}
	});

	var FoodView = Backbone.View.extend({
		el: $(".j-food-list"),

		events: {
			'click .j-food-cate': 'fnScrollToCate',
			'mouseenter .j-title-blank .classic': 'fnShowClassic',
			'mouseleave .j-foodtype-nav': 'fnHideClassic',
			'mouseenter .j-title-blank a': 'fnAAddOver',
			'mouseleave .j-title-blank a': 'fnARemoveOver',
			'click .j-add-cart': 'fnAddFoodToCart',
			'mouseenter .text-food': 'fnShowTextFood',
			'mouseleave .text-food': 'fnHideTextFood'
		},

		initialize: function() {
			this.$foodtypenav = this.$('.j-foodtype-nav');

			this.listenTo(allfoods, 'change', this.render);

			// 广播内容
			socket.on('client.menu.add', $.proxy(this.ioAddOne, this));
		},

		ioAddOne: function(f) {
			if (!f.uid || f.uid !== fqadmin) return;

			allfoods.add(f.data, {
				merge: true
			});
			carts.add(f.data, {
				merge: true
			});
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

		fnShowTextFood: function(e) {
			$(e.currentTarget).addClass('over');
		},

		fnHideTextFood: function(e) {
			$(e.currentTarget).removeClass('over');
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
			var offset = $('.j-title-blank').offset(),
				top = 50,
				left = offset.left + 32;

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

			var price = d.get('price');

			// 添加购物车动画
			self.addFoodAnim($self, price, function() {
				var cart = +d.get('cart') + 1,
					p = _.clone(d.get('orderp'));

				p.push(CUSER);

				d.set({
					'cart': cart,
					'orderp': p
				});
				carts.add(d, {
					merge: true
				});

				// 缓存到服务器
				socket.emit('server.menu.add', {
					uid: fqadmin,
					data: d
				});
			});

			function animate(time) {
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
				top: btn_offset.top - f + n / 2 - $tip.outerHeight(!0) / 2 - 30
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
		},

		render: function() {
			var p = _.clone(this.model.attributes),
				ps = _.last(p.orderp);

			p.orderp = ps;
			this.$el.html(this.template(p));

			// 总计
			cartviews && cartviews.render();

			return this;
		},

		minusOne: function() {
			var cart = +this.model.get('cart') - 1,
				ps = _.clone(this.model.get('orderp'));

			// 处理删除菜品的人员
			// if (_.contains(ps, CUSER)) {
			// 	ps.splice(_.lastIndexOf(ps, CUSER), 1);
			// } else {
			// 	_.initial(ps);
			// };
			_.initial(ps);

			if (cart === 0) {
				this.clear(ps);
				socket.emit('server.menu.remove', {
					uid: fqadmin,
					data: this.model
				});
				return;
			}
			this.model.set({
				'cart': cart,
				'orderp': ps
			});
			allfoods.get(this.model).set({
				'cart': cart,
				'orderp': ps
			});

			socket.emit('server.menu.remove', {
				uid: fqadmin,
				data: this.model
			});
		},

		plusOne: function() {
			var cart = +this.model.get('cart') + 1,
				ps = _.clone(this.model.get('orderp'));

			ps.push(CUSER);

			this.model.set({
				'cart': cart,
				'orderp': ps
			});
			allfoods.get(this.model).set({
				'cart': cart,
				'orderp': ps
			});

			socket.emit('server.menu.add', {
				uid: fqadmin,
				data: this.model
			});
		},

		clear: function(ps) {
			carts.remove(this.model);
			allfoods.get(this.model.get('id')).set({
				'cart': 0,
				'orderp': ps
			});
		}

	});

	var CartView = Backbone.View.extend({
		el: $(".j-shopping-cart"),

		carttpl: _.template($('#cartfood-template').html()),

		events: {
			'click .j-shopping-cart-footer': 'fnShoppingCart',
			'click .j-clearcart': 'fnClearCart',
			'click .j-gopay': 'fnGoPay'
		},

		initialize: function() {
			this.$cartul = this.$('.j-cartul');
			this.$orderlist = this.$('.j-order-list');
			this.$bill = this.$('.j-bill');
			this.$totalnumber = this.$('.j-totalnumber');
			this.$readypay = this.$('.j-readypay');
			this.$gopay = this.$('.j-gopay');
			this.$form = this.$('#shoppingCartForm');
			this.$brieforder = this.$('.j-brief-order');

			if (carts.models.length) {
				this.fnShoppingCart();
			};

			this.listenTo(carts, 'add', this.addOne);
			this.listenTo(carts, 'remove', this.removeOne);
			this.listenTo(carts, 'all', this.render);

			cartData.length && carts.add(cartData, {
				merge: true
			});
			allfoods.length && allfoods.add(cartData, {
				merge: true
			});

			// 广播内容
			socket.on('client.menu.add', $.proxy(this.ioAddOne, this));
			socket.on('client.menu.remove', $.proxy(this.ioRemoveOne, this));
			socket.on('client.menu.reset', $.proxy(this.ioClearCart, this));
		},

		ioAddOne: function(f) {
			if (!f.uid || f.uid !== fqadmin) return;

			carts.add(f.data, {
				merge: true
			});
		},

		ioRemoveOne: function(d) {
			if (!d.fid || d.uid !== fqadmin) return;

			var fid = d.fid,
				model = carts.get(fid),
				cart = +model.get('cart') - 1,
				ps = _.clone(model.get('orderp'));

			// 处理删除菜品的人员
			_.initial(ps);

			if (cart === 0) {
				carts.remove(model);
				allfoods.get(fid).set({
					'cart': cart,
					'orderp': ps
				});
				return;
			}

			model.set({
				'cart': cart,
				'orderp': ps
			});
			allfoods.get(fid).set({
				'cart': cart,
				'orderp': ps
			});
		},

		ioClearCart: function(d) {
			if (!d.uid || d.uid !== fqadmin) return;

			this.$orderlist.css('top', 0);

			carts.each(function(dd, i) {
				allfoods.get(dd.get('id')).set({
					'cart': 0,
					'orderp': []
				});
			});

			carts.remove(carts.models);
		},

		addOne: function(f) {
			var view = new ItemView({
				model: f
			});

			// 调整高度
			var orderh = this.$orderlist.outerHeight(true);

			this.$cartul.prepend(view.render().el);
			if (carts.models.length === 1) {
				this.fnShoppingCart();
			};

			if (orderh >= 600) {
				this.$cartul.scrollTop(0);
				return;
			}

			if (+this.$orderlist.css('top').replace('px', '') !== 0) {
				this.$orderlist.stop().animate({
					'top': -(50 + orderh)
				});
			} else {
				this.$brieforder.show();
			}
		},

		removeOne: function() {
			// 调整高度
			var orderh = this.$orderlist.outerHeight(true);

			if (+this.$orderlist.css('top').replace('px', '') !== 0) {
				this.$orderlist.stop().animate({
					'top': -orderh
				});
			}
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

			this.$brieforder.find('.count').text(n + '份').end().find('.price').text('¥' + t);
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

			var self = this,
				h = 0 - this.$orderlist.outerHeight(true);

			if (+this.$orderlist.css('top').replace('px', '') === 0) {
				this.$orderlist.animate({
					'top': h + 'px'
				}, function() {
					self.$brieforder.hide();
				});
			} else {
				this.$orderlist.animate({
					'top': 0
				}, function() {
					self.$brieforder.show();
				});
			}
		},

		fnClearCart: function() {
			this.$orderlist.css('top', 0);

			carts.each(function(d, i) {
				allfoods.get(d.get('id')).set({
					'cart': 0,
					'orderp': []
				});
			});

			carts.remove(carts.models);

			socket.emit('server.menu.reset', {
				uid: fqadmin
			});

			return false;
		},

		fnGoPay: function() {
			this.$form.submit();

			return false;
		}
	});

	var infoViews = new InfoView;
	var foodviews = new FoodView;
	var cartviews = new CartView;
});