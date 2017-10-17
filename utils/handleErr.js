function handleErr(res, callback) {
  return function() {
    const err = arguments[0];
    if (err) {
      console.log(err);
      res.json({
        code: 500,
        msg: '数据库出错了~',
        data: err
      });
      return;
    }
    callback && callback(...Array.prototype.slice.call(arguments, 1));
  }
}

module.exports = handleErr;
