var express = require('express');
var bodyParser = require('body-parser');

var app = express();

/** 允许跨域配置 **/
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8082');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/oib-api', [
  require('./modules/oib')
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