/**
 * 需要登录
 */
exports.userRequired = function(req, res, next) {
	if (!req.session || !req.session.user) {
		var originalUrl = req.originalUrl || null,
			query = originalUrl && originalUrl.indexOf('restaurant') > -1 && global.encodeURIComponent(originalUrl) || null,
			referer = query ? '/login?url=' + query : '/login';

		return res.redirect(referer);
	};
};