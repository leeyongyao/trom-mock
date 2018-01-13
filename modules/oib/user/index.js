const express = require('express');
const moment = require('moment');
const getDb = require('../../../models/oib/getDb');
const guidDb = require('../../../models/oib/guid');
const handleErr = require('../../../utils/handleErr');
const handleSuccess = require('../../../utils/handleSuccess');
const getIdQuery = require('../../../utils/getIdQuery');
const router = express.Router();

const db = getDb.user;

router.post('/login', (req, res, next) => {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  const { username, password } = req.body;
  db.findOne({ username }, handleErr(res, (user) => {
    console.log('ppp', user);
    if (!user || user.password !== password) {
      res.json({
        code: 401,
        msg: '用户名或密码错误！'
      });
      return;
    }
    req.session.username = user.username;
    handleSuccess(res)(user);
  }));
});

router.post('/logout', (req, res, next) => {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  req.session.username = null;
  handleSuccess(res)({
    isSuccess: true
  });
});

router.get('/users', (req, res, next) => {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  const { page, rows, enable } = req.query;
  const query = enable && { enable: parseInt(enable) } || {};
  db.find(query).sort({ sort: -1 }).skip((page - 1) * rows).limit(rows).exec(handleErr(res, (content) => {
    db.count(query, handleErr(res, (totalElements) => {
      handleSuccess(res)({
        totalElements,
        content
      });
    }));
  }));
});

// id只能为数字
router.get('/user/:id(\\d+)', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.findOne(getIdQuery(req), handleErr(res, handleSuccess(res)));
});

router.put('/user/:id(\\d+)', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.update(getIdQuery(req), {
    $set: Object.assign({}, req.body, {
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    })
  }, { returnUpdatedDocs: true }, handleErr(res, handleSuccess(res, null, 1)));
});

router.post('/user', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  console.log('ddd', req.body);
  guidDb.getGuid('user', res).then((id) => {
    if (req.body.token) {
      delete req.body.token;
    }
    var result = Object.assign({}, req.body, {
      id,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    db.insert(result, handleErr(res, handleSuccess(res)));
  });
});

router.delete('/user/:id(\\d+)', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  if (req.body.token === 'oib') {
    db.remove(getIdQuery(req), handleErr(res, handleSuccess(res)));
  } else {
    res.json({
      code: 401,
      msg: '无权限'
    })
  }
});

module.exports = router;