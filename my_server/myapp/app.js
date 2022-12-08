var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var https = require('https');
var fs = require('fs')

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var dataRouter = require('./routes/data');
var editRouter = require('./routes/edit');
var deviceIDRouter = require('./routes/deviceID');
var sensorDataRouter = require('./routes/sensorData');
var userDashboardDataRouter = require('./routes/dashboardData');
var getAllRouter = require('./routes/getAll');
var assignPhysicianRouter = require('./routes/assignPhysician');
var setTimeRouter = require('./routes/setTime');
var editLoginRouter = require('./routes/editLogin')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// This is to enable cross-origin access
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/physician/data', dataRouter);
app.use('/user/data', dataRouter);
app.use('/physician/edit', editRouter);
app.use('/user/edit', editRouter);
app.use('/user/deviceID', deviceIDRouter);
app.use('/user/sensorData', sensorDataRouter);
app.use('/user/dashboardData', userDashboardDataRouter);
app.use('/physician/all', getAllRouter);
app.use('/user/all', getAllRouter);
app.use('/physician/select', assignPhysicianRouter);
app.use('/time/set', setTimeRouter);
app.use('/edit/login', editLoginRouter);

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

const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);

sslServer.listen(3969, () => console.log('Secure server on port 3969'))