var factory = {
  _deepCopy: function (obj) {
    var _obj = {};
    for (var key in obj)
      _obj[key] = obj[key];
    return _obj;
  },
  _isPlainObject: function (obj) {
    if (!obj || obj.toString() !== "[object Object]" || obj.nodeType || obj.setInterval) {
      return false;
    }
    if (obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
      return false;
    }
    var key;
    for (key in obj) {
    }
    return key === undefined || obj.hasOwnProperty(key);
  },
  generateList: function (json) {
    var count = json.count || 20,
      page = json.page || 1,
      pageSize = json.pageSize || 10,
      data = [];
    count = page * pageSize <= count ? pageSize : count - (page - 1) * pageSize;
    if (this._isPlainObject(json.template)) {
      while (count--) {
        data.push(this._deepCopy(json.template))
      }
    }
    return data;
  },
  generateFile: function (res) {
    res.setHeader('Content-type', 'application/pdf');
    setTimeout(function () {
      res.setHeader("Set-Cookie", "fileDownload=true; path=/");
      res.download(__dirname + '/test.pdf');
    }, 3000);
  }
};

module.exports = factory;
