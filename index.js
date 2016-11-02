const http = require('http');
const db = require('./db');
const url = require('url');
const prepareData = require('./prepareData');//string in object in number and str
const log = require('./log');
let receivedData = {};

http.createServer((req, resp) => {
  receivedData = url.parse(req.url, true).query;
  prepareData(receivedData, (err, preparedData) => {
    db.add(preparedData, (err/*, result*/) => {
      if (err) { log(err); }
      db.getAll((err, docs) => {
        if (err) { log(err); }
        console.log(docs);
      });
    })
  });
  resp.writeHead(200, {'Content-Type': 'application/json'});
  resp.end(JSON.stringify({ 'status': 'ok' }));
}).listen(1234);
console.log('server is listening');
