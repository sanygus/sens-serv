const MongoClient = require('mongodb').MongoClient;
const map = require('async/map');
const options = require('./options');
const log = require('./log');

const dbCollectSensors = 'sensors';
const dbCollectDevices = 'devs';
let dataBase;

MongoClient.connect(options.mongoDBUrl, (err, db) => {
  if (err) {
    log(err);
  } else {
    dataBase = db;
    console.log('connect to DB success');
  }
  //db.close();
});

module.exports.add = (doc, callback) => {
  dataBase.collection(dbCollectSensors).insertOne(doc, callback);// callback(err, result)
}

module.exports.getAll = (callback) => {
  dataBase.collection(dbCollectSensors).find({}).toArray(callback);// callback(err, docs)
}

module.exports.getLastValues = (callback) => {
  getAllDevices((err, devs) => {
    if (err) { callback(err); } else {
      map(
        devs,
        (devObj, callback) => {
          const search = {};
          search[options.idDevKey] = devObj[options.idDevKey];
          dataBase.collection(dbCollectSensors).find(
            search,
            { '_id': false },
            {
              'limit': 1,
              'sort': [['date', 'desc']]
            }
          ).toArray((err, lastDocs) => {
            if (err) { callback(err); } else {
              if (lastDocs.length <=1) {
                let result = {};
                if (lastDocs.length === 1) {
                  result = lastDocs.slice()[0];
                  delete result[options.idDevKey];
                }
                result.location = devObj.location;
                callback(null, result);
              } else {
                callback(new Error('more 1 records on limit'));
              }
            }
          });
        },
        (err, lastObjs) => {
          if (err) { callback(err); } else {
            callback(null, lastObjs);
          }
        }
      );
    }
  });
}

module.exports.addDevice = (idDevice, locationDevice/*, callback*/) => {
  const doc = {};
  doc[options.idDevKey] = idDevice;
  dataBase.collection(dbCollectDevices).find(doc).count((err, count) => {
    if (err) { throw(err); } else {
      if (count === 0) {
        doc['location'] = locationDevice;
        dataBase.collection(dbCollectDevices).insertOne(doc/*, callback*/);
      } else {
        throw(new Error('device with this id already exist (' + count + ')'));
      }
    }
  });
  //example const db = require('./db'); db.addDevice('ididiid0','loc2');
}

const getAllDevices = (callback) => {
  dataBase.collection(dbCollectDevices).find({}).toArray(callback);
}

module.exports.getAllDevices = getAllDevices;
