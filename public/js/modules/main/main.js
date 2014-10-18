define('modules/main/main', function(require, exports) {
	var $ = require('jquery');

	var $top = $('#triffle .top');

	$(window).scroll(function() {
		var h = $(this).scrollTop();
		if (h >= 800) {
			$top.css('visibility', 'visible');
		} else {
			$top.css('visibility', 'hidden');
		}
	});

	$top.click(function(){
		$('html, body').animate({scrollTop: 0});
	});

	$('body').on('click', '.j-top-tips-close', function(){
		$(this).parent().addClass('hidden');
	});
});