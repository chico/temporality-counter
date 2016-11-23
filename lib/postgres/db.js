/* Copyright (c) 2016 Chico Charlesworth, MIT License */

var pg = require('pg');

var uuid = require('uuid');

var config = require('../config/db');

var temporalities = require('../temporalities');
var utils = require('../utils');

var connectionString = config.url;

var getCounter = function(counterId, counterType, start, temporality, cb) {

  if (!temporalities.validate(temporality)) {
    return cb(new Error('Invalid temporality [' + temporality + ']'));
  }

  var results = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        return cb(err);
      }

      var queryText = 'SELECT * FROM counter where counter_id=($1) and counter_type=($2) and start=($3) and temporality=($4)'
      var queryValues = [counterId, counterType, start, temporality];

      var query = client.query(queryText, queryValues);

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();

          return cb(null, (results.length > 0) ? results[0] : null);
      });

  });

}

var countById = function(counterId, startFrom, temporality, cb) {

  if (!temporalities.validate(temporality)) {
    return cb(new Error('Invalid temporality [' + temporality + ']'));
  }

  var results = [];
  startFrom = utils.truncateDate(startFrom, temporality);

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        return cb(err);
      }

      var queryText = 'SELECT sum(total) FROM counter where counter_id=($1) and temporality=($2)'
      var queryValues = [counterId, temporality];

      if (temporalities.ALL_TIME != temporality) {
        queryText += ' and start >= ($3)';
        queryValues.push(startFrom);
      }

      var query = client.query(queryText, queryValues);

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();
          // Aggregate counts
          return cb(null, (results.length > 0 && results[0].sum) ? results[0].sum : 0);
      });

  });

}

var countByIdAndType = function(counterId, counterType, startFrom, temporality, cb) {

  if (!temporalities.validate(temporality)) {
    return cb(new Error('Invalid temporality [' + temporality + ']'));
  }

  var results = [];
  startFrom = utils.truncateDate(startFrom, temporality);

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        return cb(err);
      }

      var queryText = 'SELECT sum(total) FROM counter where counter_id=($1) and counter_type=($2) and temporality=($3)'
      var queryValues = [counterId, counterType, temporality];

      if (temporalities.ALL_TIME != temporality) {
        queryText += ' and start >= ($4)';
        queryValues.push(startFrom);
      }

      var query = client.query(queryText, queryValues);

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();
          // Aggregate counts
          return cb(null, (results.length > 0 && results[0].sum) ? results[0].sum : 0);
      });

  });

}

var insert = function(counterId, counterType, start, temporality, cb) {

  if (!temporalities.validate(temporality)) {
    return cb(new Error('Invalid temporality [' + temporality + ']'));
  }

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        return cb(err);
      }

      var values = [
        uuid.v4(), counterId, counterType, start, temporality, 1
      ];

      // INSERT INTO counter(oid, counter_id, counter_type, start, temporality, total) values('123', 'kwikdesk', 'number', to_timestamp('01-01-1970 00:00:00', 'dd-mm-yyyy hh24:mi:ss'), 'ALL_TIME', 1);

      client.query("INSERT INTO counter(oid, counter_id, counter_type, start, temporality, total) values($1, $2, $3, $4, $5, $6)", values, function(err, result) {

        // Release DB client back to the pool
        done();

        if (err) {
          return cb(err);
        }

        return cb(null);
      });

  });

}

var increment = function(oid, cb) {

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        return cb(err);
      }

      client.query("UPDATE counter SET total = total + 1 WHERE oid = ($1)", [oid], function(err, result) {

        // Release DB client back to the pool
        done();

        if (err) {
          return cb(err);
        }

        return cb(null);
      });

  });

}

module.exports = {
  getCounter: getCounter,
  countById: countById,
  countByIdAndType: countByIdAndType,
  insert: insert,
  increment: increment
}