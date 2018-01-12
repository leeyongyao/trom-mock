var express = require('express');
var session = require('express-session');
var NedbStore = require('express-nedb-session')(session);
var bodyParser = require('body-parser');

var app = express();

/** 允许跨域配置 **/
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(session({
  secret: 'yoursecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 3600 * 1000   // One hour for example
  },
  store: new NedbStore({ filename: './db/oib/session/session.db' })
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  if (/user/.test(req.url) && (req.body.token !== 'oib' || req.query.token !== 'oib')) {
    res.json({
      code: 401,
      msg: '没有token'
    });
    return;
  }

  if (req.method !== 'GET' && !/login/.test(req.url) && !req.session.username) {
    res.json({
      code: 401,
      msg: '请登录！'
    });
    return;
  }
  console.log('ppp', req);
  next();
});

app.use('/oib-api', [
  // require('./modules/oib')
  require('./modules/oib/about'),
  require('./modules/oib/about-sliders'),
  require('./modules/oib/work'),
  require('./modules/oib/news'),
  require('./modules/oib/customer'),
  require('./modules/oib/customer-sliders'),
  require('./modules/oib/service-tag'),
  require('./modules/oib/industry'),
  require('./modules/oib/user')
]);

app.use(function(req, res, next) {
  res.status(404).json({
    'code': 404,
    'msg': 'not found'
  });
});

app.use(function(req, res, next) {
  res.status(500).json({
    'code': 500,
    'msg': '服务器错误'
  });
});

app.listen(9999, function() {
  console.log('listening in port 9999');
});