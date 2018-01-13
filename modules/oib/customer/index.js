const express = require('express');
const moment = require('moment');
const getDb = require('../../../models/oib/getDb');
const guidDb = require('../../../models/oib/guid');
const handleErr = require('../../../utils/handleErr');
const handleSuccess = require('../../../utils/handleSuccess');
const getIdQuery = require('../../../utils/getIdQuery');
const auth = require('../../../utils/auth');
const router = express.Router();

const db = getDb.customer;

router.get('/customers', (req, res, next) => {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  const { enable } = req.query;
  const query = enable && { enable: parseInt(enable) } || {};
  db.find(query).skip(req.query.page - 1).limit(req.query.rows).exec(handleErr(res, (content) => {
    db.count(query, handleErr(res, (totalElements) => {
      handleSuccess(res)({
        totalElements,
        content
      });
    }));
  }));
});

// id只能为数字
router.get('/customer/:id(\\d+)', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.findOne(getIdQuery(req), handleErr(res, handleSuccess(res)));
});

router.put('/customer/:id(\\d+)', auth.ensureAuthorized, function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.update(getIdQuery(req), {
    $set: Object.assign({}, req.body, {
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    })
  }, { returnUpdatedDocs: true }, handleErr(res, handleSuccess(res, null, 1)));
});

router.post('/customer', auth.ensureAuthorized, function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  guidDb.getGuid('customer', res).then((id) => {
    var result = Object.assign({}, req.body, {
      id,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    db.insert(result, handleErr(res, handleSuccess(res)));
  });
});

router.delete('/customer/:id(\\d+)', auth.ensureAuthorized, function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.remove(getIdQuery(req), handleErr(res, handleSuccess(res)));
});

module.exports = router;