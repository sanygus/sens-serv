const http = require('http');
const url = require('url');
const db = require('./db.js');
let receivedData = {};

http.createServer((req, resp) => {
  receivedData = url.parse(req.url, true).query;
  db.add(receivedData, () => {
    db.getAll((arr)=>{console.log(arr);});
  });
  resp.writeHead(200, {'Content-Type': 'application/json'});
  resp.end(JSON.stringify({ 'status': 'ok' }));
}).listen(1234);

console.log('server is listening');
