const express = require('express');
const moment = require('moment');
const getDb = require('../../../models/oib/getDb');
const guidDb = require('../../../models/oib/guid');
const handleErr = require('../../../utils/handleErr');
const handleSuccess = require('../../../utils/handleSuccess');
const getIdQuery = require('../../../utils/getIdQuery');
const router = express.Router();

const db = getDb.news;

router.get('/newses', (req, res, next) => {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  const { page, rows, enable } = req.query;
  const query = enable && { enable: parseInt(enable) } || {};
  db.find(query).skip((page - 1) * rows).limit(rows).exec(handleErr(res, (content) => {
    db.count(query, handleErr(res, (totalElements) => {
      handleSuccess(res)({
        totalElements,
        content
      });
    }));
  }));
});

router.get('/news/recommendedList', (req, res, next) => {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  const { id } = req.query;
  db.find({ $not: { id: parseInt(id) } }).exec(handleErr(res, (content) => {
    let count = 4;
    if (content.length <= count) {
      handleSuccess(res)(content);
      return;
    }
    let results = [];
    for (let i = 0; i < count; i++) {
      const index = parseInt(Math.random() * content.length);
      results.push(content[index]);
    }
    // let indexList = [];
    // while (indexList.length <= count) {
    //   const index = parseInt(Math.random() * content.length);
    //   if (indexList.indexOf(index) > -1) {
    //     results.push(content[index]);
    //     indexList.push(index);
    //   }
    // }
    handleSuccess(res)(results);
  }));
});

// id只能为数字
router.get('/news/:id(\\d+)', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.findOne(getIdQuery(req), handleErr(res, handleSuccess(res)));
});

router.put('/news/:id(\\d+)', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.update(getIdQuery(req), {
    $set: Object.assign({}, req.body, {
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    })
  }, { returnUpdatedDocs: true }, handleErr(res, handleSuccess(res, null, 1)));
});

router.post('/news', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  guidDb.getGuid('news', res).then((id) => {
    var result = Object.assign({}, req.body, {
      id,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    db.insert(result, handleErr(res, handleSuccess(res)));
  });
});

router.delete('/news/:id(\\d+)', function(req, res, next) {
  console.log('\n=============================');
  console.log(req.route.stack[0].method, req.route.path, 'success');
  db.remove(getIdQuery(req), handleErr(res, handleSuccess(res)));
});

module.exports = router;