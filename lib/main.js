/* Copyright (c) 2016 Chico Charlesworth, MIT License */

var db = require('./db');
var temporalities = require('./temporalities');

function Counter() {
}

Counter.count = function (counterId, startFrom, temporality, cb) {
	db.countById(counterId, startFrom, temporality, cb);
};

Counter.countByIdAndType = function (counterId, counterType, startFrom, temporality, cb) {
	db.countByIdAndType(counterId, counterType, startFrom, temporality, cb);
};

Counter.incrementAndGet = function(counterId, counterType, temporality, cb) {
	db.incrementAndGet(counterId, counterType, temporality, cb);
};

Counter.temporality = temporalities;

module.exports = Counter;
