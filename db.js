const MongoClient = require('mongodb').MongoClient;
const dbCollect = 'sensors';
let dataBase;

MongoClient.connect('mongodb://localhost:27017/sens-serv', (err, db) => {
  if(err) throw err;
  dataBase = db;
  console.log('connect to DB success');
  /*db.collection('sensors').insertOne({ var: 123.45, str: 'string'}, (err, result) => {
    if(err) throw err;
    console.log("result is");
    //console.log(result);
    db.close();
  });*/
  /*const cursor = db.collection('sensors').find();
  cursor.each((err, doc) => {
    if(doc !== null) console.dir(doc);
    db.close();
  });*/
  /*db.collection('sensors').drop((err, resp) => {
    console.log(resp);
  })*/

  //db.close();
  /*add({asd: 123}, () => {
    console.log('ok');
  });*/
  /*getAll((items) => {
    console.log(items);
  });*/
});

module.exports.add = (doc, callback) => {
  dataBase.collection(dbCollect).insertOne(doc, (err, result) => {
    if (err) throw err;
    callback();
  })
}

module.exports.getAll = (callback) => {
  const docs = [];
  const cursor = dataBase.collection(dbCollect).find();
  cursor.each((err, doc) => {
    if (err) throw err;
    if (doc !== null) {
      docs.push(doc);
    } else {
      callback(docs);
    }
  });
}
