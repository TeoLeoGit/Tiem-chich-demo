const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const passport = require('./auth/passport');
const session = require('express-session');

const flash = require('express-flash');

const db = require('./database');
//Connect to mongo
db.connectMongoDB(process.env.DB_HOST);


const indexRouter = require('./routes/index');
// const routes = require('./routes/index')(passport);
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const analyticsRouter = require('./routes/analytics');
const ordersRouter = require('./routes/orders');
const userAccountsRouter = require('./routes/userAccounts');
const stocksRouter = require('./routes/stocks');
const receivedOrdersRouter = require('./routes/receivedOrders');
const adminProfileRouter = require('./routes/adminProfile');
const adminsRouter = require('./routes/admins');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(session({secret: "mySecret"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session())

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})
app.use(flash());

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/analytics', analyticsRouter);
app.use('/orders', ordersRouter);
app.use('/userAccounts', userAccountsRouter);
app.use('/stocks', stocksRouter);
app.use('/receivedOrders', receivedOrdersRouter);
app.use('/adminProfile', adminProfileRouter);
app.use('/userAccountId', userAccountsRouter);
app.use('/admins', adminsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
