define('modules/search/search', function(require, exports, modules) {
	var $ = require('jquery');

	var Search = function(input, options) {
		if (arguments.length !== 2) throw new Error("it must has 2 args!");
		var $input = typeof input === 'string' && $(input) || (input instanceof $ && input) || null;
		if (!$input.length) return;
		this.input = input;

		options || (options = {});
		var opts = $.extend({}, Search.defaults, options);

		this.init($input, opts);
	};

	Search.prototype = {
		init: function($input, opts) {
			var self = this,
				$list,
				timer;

			this.$input = $input;
			this.opts = opts;

			// ul list
			this.$list = ($list = $('.j-search-list'))[0] && $list || $('<ul class="search-list j-search-list" style="display: none;"></ul>').appendTo(opts.el);

			// focus event
			$(opts.el).on('click.search', this.input, function(e) {
				// show ul list
				self.showList(e);

				return false;
			});

			// keyup event
			$('body').on('keyup propertychange input paste filter', this.input, function(e) {
				self.showList(e);
			});

			// item click event
			$('body').on('click', '.j-search-item', function(e) {
				e.stopPropagation();

				var value = $(this).text();
				$input.val(value);
				$('.j-search-list').hide();

				self.skipToNode(value);
			});

		},

		skipToNode: function(v) {
			if (!v) return;

			var $food = $('.text-food .nodesc[title="' + v + '"]'),
				$textfood = $food.closest('.text-food'),
				top = $('.text-food .nodesc[title="' + v + '"]').offset().top - 200;

			$('html, body').animate({
				scrollTop: top + 'px'
			});

			var timer = setInterval(function() {
				if ($textfood.hasClass('over')) {
					$textfood.removeClass('over');
				} else {
					$textfood.addClass('over');
				};
			}, 100);
			setTimeout(function() {
				clearTimeout(timer);
			}, 1e3);

		},

		showList: function(e) {
			var self = this,
				opts = this.opts,
				$input = $(e.target),
				value = $.trim($input.val()),
				re = new RegExp(value.replace(/\s/g, '')),
				fixed = $input.hasClass('j-fixed'),
				offset = {
					top: 0,
					left: 0
				},
				_width,
				_offset,
				tpl;

			if (value && (tpl = self.getItems(re))) {
				_offset = $input.offset();
				offset.top = $input.outerHeight(true) + _offset.top + 'px';
				offset.left = _offset.left + 'px';
				_width = $input.outerWidth(true);
				offset = $.extend({}, offset, {
					"width": _width,
					"z-index": opts.zindex,
					"position": (fixed ? "fixed" : "absolute"),
					"top": (fixed ? '50px' : offset.top)
				});
				self.$list.html('').append(tpl).css(offset).show();

			} else {
				self.$list.html('').hide();
			};
		},

		getItems: function(re) {
			var opts = this.opts;
			if (!opts.tpl || !re) throw new Error("it must has tpl && re option!");

			var _tpl = '';

			$.each(opts.data, function(i, d) {
				if (re.test(d.name)) {
					_tpl += opts.tpl({
						id: d.id,
						name: d.name,
						price: d.price
					});
				}
			});

			return _tpl;
		}
	};

	Search.defaults = {
		el: 'body',
		data: [],
		tpl: null,
		zindex: 10000
	};

	modules.exports = Search;
});