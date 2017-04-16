const express = require('express');
const db = require('./db');
const prepareData = require('./prepareData');
const log = require('./log');
const fs = require('fs');
const { httpPort, idDevKey, servicePath } = require('./options');

const server = express();
const devStatus = {};//0 - nothing, 1 - wakeup, 2 - reboot

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

server.get('/log', (req, res) => {
  if (req.query) {
    db.addEvent(req.query, (err) => {
      if (err) {
        log(err);
        res.type('application/json').status(500).send({status: 'can\'t save event in DB'});
      } else {
        res.type('application/json').status(202).send({status: 'ok'});
      }
    });
  } else {
    res.type('application/json').status(400).send({status: 'no data'});
  }
});

server.get('/' + servicePath + '/:filename', (req, res) => {
  const fileName = req.params.filename;
  res.sendFile(fileName, { root: __dirname + '/' + servicePath + '/' }, (err) => {
    if (err) {
      res.status(err.status).end();
    } else {
      log('dev download ' + servicePath + '/'  + fileName);
      fs.rename(__dirname + '/' + servicePath + '/' + fileName, __dirname + '/' + servicePath + '/' + fileName + '.ok', () => {});
    }
  });
});

server.get('/watch', (req, res) => {
  if ((req.query[idDevKey]) && (req.query.action)) {
    if (req.query.action === 'get') {
      if (devStatus[req.query[idDevKey]] === undefined) { devStatus[req.query[idDevKey]] = 0; }
      res.type('text/plain').status(200).send(devStatus[req.query[idDevKey]].toString());
      devStatus[req.query[idDevKey]] = 0;
    } else if ((req.query.action === 'set') && (req.query.status)) {
      devStatus[req.query[idDevKey]] = parseInt(req.query.status);
      res.setHeader("Access-Control-Allow-Origin: http://geoworks.pro");
      res.type('application/json').status(200).send({ status: 'ok' });
    } else {
      res.type('application/json').status(500).send({ status: 'error2' });
    }
  } else {
    res.type('application/json').status(500).send({ status: 'error' });
  }
});

server.listen(httpPort, () => {
  console.log(`server listening on ${httpPort} port`);
});
