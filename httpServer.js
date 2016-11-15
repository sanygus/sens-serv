const http = require('http');
const db = require('./db');
const url = require('url');
const prepareData = require('./prepareData');//string in object in number and str
const log = require('./log');
const { httpPort } = require('./options');

const handler = (req, resp) => {
  const { pathname: path, query: receivedData } = url.parse(req.url, true);
  console.log(path, receivedData);
  switch (path) {
    case '/':
      resp.writeHead(200, {'Content-Type': 'text/html'});
      resp.end('<h1>1234</h1>');
      ejs
      break;
    case '/api':
      resp.writeHead(200, {'Content-Type': 'application/json'});
      resp.end(JSON.stringify({ 'status': 'ok' }));
    default:
      resp.writeHead(404, {'Content-Type': 'text/html'});
      resp.end('Sorry, not found');

  }
  /*prepareData(receivedData, (err, preparedData) => {
    if (err) { log(err); }
    if (preparedData) {
      db.add(preparedData, (err/*, result*//*) => {
        if (err) { log(err); }
        db.getAll((err, docs) => {
          if (err) { log(err); }
          console.log(docs);
        });
      });
    }
  });*/
}

http.createServer(handler).listen(httpPort);
console.log('server is listening on port ' + httpPort);
