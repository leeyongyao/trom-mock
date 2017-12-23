function handleSuccess(res, callback, argumentIndex = 0, nullValue = {}) {
  return function() {
    callback && callback(arguments[argumentIndex]);
    res.json({
      code: 200,
      msg: '',
      data: arguments[argumentIndex] || nullValue
    });
  }
}

module.exports = handleSuccess;