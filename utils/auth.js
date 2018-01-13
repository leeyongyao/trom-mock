exports.ensureAuthorized = (req, res, next) => {
  if (!req.session.username) {
    res.json({
      code: 401,
      msg: '请登录！'
    });
    return;
  }
  console.log('auth ', req);
  next();
};

exports.ensureAdminToken = (req, res, next) => {
  if (req.method === 'POST' && req.body.token !== 'tron-m!oib' ||
      req.method === 'GET' && req.query.token !== 'tron-m!oib') {
    res.json({
      code: 401,
      msg: '没有token!'
    });
    return;
  }
  next();
};