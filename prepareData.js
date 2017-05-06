const options = require('./options');

module.exports = (data, callback) => {
  const newdata = {};
  let isData = false;
  for(key in data) {
    if ((key !== options.idDevKey) && (key !== 'date')) {
      if (data[key].indexOf(',') > 0) {
        newdata[key] = data[key].split(',').map((item) => {
          return parseFloat(item);
        });
      } else {
        newdata[key] = parseFloat(data[key]);
      }
    } else {
      newdata[key] = data[key];
    }
    isData = true;
  }
  if (!isData) {
    return callback(new Error('no data in query'));
  }
  newdata.receive_date = new Date();
  callback(null, newdata);
}
