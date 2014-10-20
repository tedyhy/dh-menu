var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var config = require('./config.default');
// route
var index = require('./routes/index');
var restaurant = require('./routes/restaurant');
// app
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.engine('.html', require('ejs').__express);
// app.set('view engine', 'html');

// middleware
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: config.session_secret}));
// custom middleware
app.use(require('./controllers/sign').auth_user);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(logger('dev'));
}
// static resource
app.use('/static', express.static(path.join(__dirname, 'public')));
// route
app.use('/', index);
app.use('/restaurant', restaurant);

// app.set('env', 'production');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;