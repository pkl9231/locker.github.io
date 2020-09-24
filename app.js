var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
var http = require('http');
var request = require('request');
var flash = require('connect-flash');
var session = require('express-session');

//  handlebars
var hbs = require('hbs');
var expHbs = require('express-handlebars');
var helpers = require('handlebars-helpers')()
const bodyParser = require('body-parser');

var indexRouter = require('./routes/user');
var usersRouter = require('./routes/v1/users');
var inquiryRouter = require('./routes/v1/inquiry');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));

var hbs = expHbs.create({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, '/views/layouts/'),
  defaultLayout: 'main',
  helpers: helpers,
  partialsDir: {
    dir: path.join(__dirname, 'views/partials/')
  }
})
// view engine setup
app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  secret: "abc",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1*60*60*1000
  },
  rolling: true
}));

app.use('/', indexRouter);

// API ROUTES START
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/inquiry', inquiryRouter);

app.use(function (req, res, next) {
  res.header('Cache-Control', 'no-cache');
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
  next();
});


app.disable('etag'); // to remove 304 erro
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).render('error', { message: 'Route' + req.url + ' Not found.' });
  // next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
