const options = require('./options');

module.exports = (data, callback) => {
  const newdata = {};
  for(key in data) {
    if (key !== options.idDevKey) {
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
  }
  callback(null, newdata);
}
