/**
 * 需要登录
 */
var config = require('../config.default');

exports.userRequired = function(req, res, next) {
	if (!req.session || !req.session.user) {
		var originalUrl = req.originalUrl || null,
			query = originalUrl && global.encodeURIComponent(originalUrl) || null,
			referer;

		referer = query ? '/login?url=' + query : '/login';

		return res.redirect(referer);
	};
};