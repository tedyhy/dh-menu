var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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
if (app.get('env') === 'development') {
    app.use(logger('dev'));
}
// static resource
app.use('/static', express.static(path.join(__dirname, 'public')));

// route
app.use('/', index);
app.use('/restaurant', restaurant);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// app.set('env', 'production');

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    // app.use(logger('dev'));
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

module.exports = app;