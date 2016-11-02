const MongoClient = require('mongodb').MongoClient;
const options = require('./options');
const log = require('./log');

const dbCollectSensors = 'sensors';
let dataBase;

MongoClient.connect(options.mongoDBUrl, (err, db) => {
  if (err) {
    log(err);
    throw err;
  }
  dataBase = db;
  console.log('connect to DB success');
  //db.close();
});

module.exports.add = (doc, callback) => {
  dataBase.collection(dbCollectSensors).insertOne(doc, callback);
}

module.exports.getAll = (callback) => {
  dataBase.collection(dbCollectSensors).find({}).toArray(callback);
}
