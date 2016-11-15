const express = require('express');
const db = require('./db');
const prepareData = require('./prepareData');
const log = require('./log');

const server = express();
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
  db.getLastValues((err, values) => {
    if (err) {
      log(err);
      res.render('error');
    } else {
      res.render('index', { values });
    }
  });
});
server.get('/dev', (req, res) => {
  prepareData(req.query, (err, preparedData) => {
    if (err) { log(err); }
    if (preparedData) {
      db.add(preparedData, (err) => {
        if (err) { log(err); }
      })
      res.type('application/json').status(202).send({status: 'ok'});
    } else {
      res.type('application/json').status(400).send({status: 'no data'});
    }
  });
});

server.listen(12345, () => {
  console.log('listening');
});
