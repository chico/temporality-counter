/* Copyright (c) 2016 Chico Charlesworth, MIT License */

var config = require('./config/db');

var temporalities = require('./temporalities');
var utils = require('./utils');

var getDb = function(cb) {
  var databaseType = null;

  if (config.url.indexOf('postgres://') == 0) {
    databaseType = 'postgres';
  }

  if (!databaseType) {
    return cb(new Error('Database ' + config.url + ' not supported.'));
  }

  var dbLibrary = './' + databaseType + '/db';
  try {
      require.resolve(dbLibrary);
  } catch(e) {
      return cb(new Error('Database ' + config.url + ' not supported.'));
  }

  return cb(null, require(dbLibrary));
}

var getCounter = function(counterId, counterType, start, temporality, cb) {
  getDb(function(err, db) {
    if (err) {return cb(err)};
    if (db) {db.getCounter(counterId, counterType, start, temporality, cb);}
  });
}

var countById = function(counterId, startFrom, temporality, cb) {
  getDb(function(err, db) {
    if (err) {return cb(err)};
    if (db) {db.countById(counterId, startFrom, temporality, cb);}
  });
}

var countByIdAndType = function(counterId, counterType, startFrom, temporality, cb) {
  getDb(function(err, db) {
    if (err) {return cb(err)};
    if (db) {db.countByIdAndType(counterId, counterType, startFrom, temporality, cb);}
  });
}

var insert = function(counterId, counterType, start, temporality, cb) {
  getDb(function(err, db) {
    if (err) {return cb(err)};
    if (db) {db.insert(counterId, counterType, start, temporality, cb);}
  });
}

var increment = function(oid, cb) {
  getDb(function(err, db) {
    if (err) {return cb(err)};
    if (db) {db.increment(oid, cb);}
  });
}

var incrementAndGet = function(counterId, counterType, temporality, cb) {

  if (!temporalities.validate(temporality)) {
    return cb(new Error('Invalid temporality [' + temporality + ']'));
  }

  var start = utils.truncateDate(new Date(), temporality);

  getCounter(counterId, counterType, start, temporality, function(err, counter) {
    if (err) {
      console.log('Whoops! Get counter failed - %j', err);
      return cb(err);
    }

    if (!counter) {
      // Insert
      insert(counterId, counterType, start, temporality, function(err, counter) {
        if (err) {
          console.log('Whoops! Insert failed - %j', err);
          return cb(err);
        }

        countByIdAndType(counterId, counterType, start, temporality, function(err, count) {
          if (err) {
            console.log('Whoops! Count by id failed - %j', err);
            return cb(err);
          }
          return cb(null, count);
        });

      });
    } else {
      increment(counter.oid, function(err, counter) {
        if (err) {
          console.log('Whoops! Increment failed - %j', err);
          return cb(err);
        }

        countByIdAndType(counterId, counterType, start, temporality, function(err, count) {
          if (err) {
            console.log('Whoops! Count by id failed - %j', err);
            return cb(err);
          }
          return cb(null, count);
        });
      });
    }
  })
}

module.exports = {
  getCounter: getCounter,
  countById: countById,
  countByIdAndType: countByIdAndType,
  insert: insert,
  increment: increment,
  incrementAndGet: incrementAndGet
}