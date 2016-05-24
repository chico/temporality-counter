/* Copyright (c) 2016 Chico Charlesworth, MIT License */
'use strict';

// Requires postgres to be installed locally and 'counter' database to have been created
// npm install -g mocha
// mocha main.test.js

var assert = require('chai').assert;
var Promise = require('bluebird');

var counter = require('../lib/main.js');
Promise.promisifyAll(counter);

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var counterId = 'resource-' + getRandomInt(10000000, 99999999);
var counterType = 'resource-type-123';
var counterTypeRandom = 'resource-type-' + getRandomInt(10000000, 99999999);
var temporality = 'HOURLY';

describe('Counter', function() {

	it('incrementAndGetAndCount', function( done ) {

		// First count should return 0
		counter.countAsync(counterId, new Date(), temporality).then(function(count) {
			assert.equal(true, count == 0, 'Counter ' + counterId + ' is ' + count + ', expected 0.');

			// Increment for first time
			counter.incrementAndGetAsync(counterId, counterType, temporality).then(function(count) {
				assert.equal(true, count == 1, 'Counter ' + counterId + ' is ' + count + ', expected 1.');

				// Increment a second time to make sure increment is working ok
				counter.incrementAndGetAsync(counterId, counterType, temporality).then(function(count) {
					assert.equal(true, count == 2, 'Counter ' + counterId + ' is ' + count + ', expected 2.');

					// Double check count
					counter.countAsync(counterId, new Date(), temporality).then(function(count) {
						assert.equal(true, count == 2, 'Counter ' + counterId + ' is ' + count + ', expected 2.');
						done();
					});

				});

			});

		});

  });

  it('incrementAndGetAndCountByIdAndType', function( done ){

  	counter.incrementAndGetAsync(counterId, counterTypeRandom, temporality).then(function(count) {
			assert.equal(true, count == 1, 'Counter ' + counterId + ' and type ' + counterTypeRandom + ' is ' + count + ', expected 1.');

			counter.countByIdAndTypeAsync(counterId, counterTypeRandom, new Date(), temporality).then(function(count) {
				assert.equal(true, count == 1, 'Counter ' + counterId + ' and type ' + counterTypeRandom + ' is ' + count + ', expected 1.');
				done();
			});

		});

  });

});