const nedb = require('nedb');
const path = require('path');
const handleErr = require('../../../utils/handleErr');

const db = new nedb({
  filename: path.join(__dirname, '../../../db/oib/guid/guid.db'),
  autoload: true
});
const initIndex = 1;
function getGuid(id, res) {
  return new Promise((resolve, rejest) => {
    db.findOne({ id }, handleErr(res, (data) => {
      if (!data) {
        db.insert(
          { id, guid: initIndex },
          handleErr(res, ({guid}) => {
            resolve(guid);
          }));
      } else {
        db.update(
          { id },
          { $inc: { guid: 1 } },
          { returnUpdatedDocs: true },
          handleErr(res, (num, { guid }) => {
            resolve(guid);
          }));
      }
    }));
  });
}

module.exports = {
  getGuid
};