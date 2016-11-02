const http = require('http');
//const db = require('./db');
const url = require('url');
const prepareData = require('./prepareData');//string in object in number and str
let receivedData = {};

http.createServer((req, resp) => {
  receivedData = url.parse(req.url, true).query;
  prepareData(receivedData, (err, preparedData) => {
  });
  /*db.add(receivedData, () => {
    db.getAll((arr) => {
      console.log(arr);
    });
  });*/
  resp.writeHead(200, {'Content-Type': 'application/json'});
  resp.end(JSON.stringify({ 'status': 'ok' }));
}).listen(1234);

console.log('server is listening');
