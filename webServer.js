const express = require('express');
const db = require('./db');
const prepareData = require('./prepareData');
const log = require('./log');
const { httpPort } = require('./options');

const server = express();
server.use('/static', express.static('static'));
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
  db.getLastValues((err, values) => {
    if (err) {
      log(err);
      res.status(500).render('error');
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
        if (err) {
          log(err);
          res.type('application/json').status(500).send({status: 'can\'t save in DB'});
        } else {
          res.type('application/json').status(202).send({status: 'ok'});
        }
      });
    } else {
      res.type('application/json').status(400).send({status: 'no data'});
    }
  });
});

server.listen(httpPort, () => {
  console.log(`server listening on ${httpPort} port`);
});
