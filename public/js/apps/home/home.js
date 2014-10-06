define('apps/home/home', function(require, exports) {
	var $ = require('jquery'),
		doT = require('libs/doT/doT'),
		data = eval("(" + $('.j-restlistdata').val() + ")"),
		dialog_left_tpl = '<div class="dialog dialog-discount j-dialog" style="display: none;"><div class="tips-dialog"><div class="header"></div><div class="body"><div class="content"><div class="title">{{=it.name}}</div><div class="broadcaster"><div class="sub-title">餐厅公告</div><div class="broadcontent">{{=it.broad_content}}</div></div></div></div><div class="footer"></div></div></div>',
		dialog_left = doT.compile(dialog_left_tpl),
		dialog_right_tpl = '<div class="dialog dialog-discount j-dialog" style="display: none;"><div class="tips-dialog"><div class="header header-rev"></div><div class="body body-rev"><div class="content"><div class="title">{{=it.name}}</div><div class="broadcaster"><div class="sub-title">餐厅公告</div><div class="broad_content">{{=it.broadcontent}}</div></div></div></div><div class="footer footer-rev"></div></div></div>',
		dialog_right = doT.compile(dialog_right_tpl);

	$('ul.j-restlist li.j-restaurant').hover(function() {
		var $this = $(this),
			index = +$this.attr('data-index') || 0;

		showDialog($(this), data[index])
	}, function() {
		hideDialog($(this));
	});

	function showDialog($ele, d) {
		var offset = $ele.offset(),
			width = $ele.outerWidth(true),
			top = offset.top || 0,
			left = offset.left || 0,
			_class = 'left',
			dialog = dialog_left;

		if (left >= width * 2) {
			left = left - width - 40;
			_class = 'right';
			dialog = dialog_right;
		} else {
			left = left + width;
		}

		$ele.find('.restaurant').addClass('hover');
		$(dialog(d)).appendTo('body').css({
			top: top,
			left: left
		}).show(200);
	}

	function hideDialog($ele) {
		$ele.find('.restaurant').removeClass('hover');
		$('.j-dialog').remove();
	}

});