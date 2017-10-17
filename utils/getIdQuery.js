function getIdQuery(req) {
  return { id: +req.params.id };
}

module.exports = getIdQuery;
