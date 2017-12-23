const express = require('express');
const moment = require('moment');
const getDb = require('../../../models/oib/getDb');
const handleErr = require('../../../utils/handleErr');
const handleSuccess = require('../../../utils/handleSuccess');
const router = express.Router();

const db = getDb.customerSliders;

router.get('/customer-sliders', (req, res, next) => {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.findOne({}, handleErr(res, handleSuccess(res, null, null, [])));
});

router.post('/customer-sliders', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  const data = Object.assign({}, req.body, {
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  });
  db.update({}, data, { returnUpdatedDocs: true, upsert: true }, handleErr(res, handleSuccess(res, null, 1, [])));
});

module.exports = router;