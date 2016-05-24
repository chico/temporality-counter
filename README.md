# Temporality Counter

Temporality Counter is a simple NodeJS library that efficiently increments counters to a database based on a given temporality.

The library can then query the database and return a total count for a given time period and temporality, for example:
 * How many users have registered to our website?
 * How many web hits did my website receive during the last hour?
 * How many API calls were made since midnight?
 * How many login attempts did a user try in the last 30 minutes?
 * How many web purchases have been made in the past 30 days? How many so far this month?

Supported temporalities are:
 * ALL_TIME - Keeps a ever running counter.
 * DAILY - One counter for every day, each starting at midnight.
 * HOURLY - One counter for every hour, each starting at the beginning of the hour.
 * EVERY_MINUTE - One counter for every minute, each starting at the beginning of the minute.

Choose one or more temporalities that fits your requirements. The more granular the temporality (e.g. EVERY_MINUTE) the more rows will be kept in the database, and therefore potentially more expensive query times. If you wanted to know a count for the last 60 minutes then you should choose EVERY_MINUTE, for the last 24 hours then HOURLY, for the last 30 days then DAILY, and for all time then ALL_TIME.

## Installation

The following will install [https://www.npmjs.org/package/temporality-counter](https://www.npmjs.org/package/temporality-counter) and add it as a dependency to your project:

```
npm install temporality-counter -S
```

### Install Postgres

OSX:
```
brew install postgresql
postgres -D /usr/local/var/postgres`
```

For other platforms see [https://wiki.postgresql.org/wiki/Detailed_installation_guides](https://wiki.postgresql.org/wiki/Detailed_installation_guides).

### Create counter database and table

```
psql -d postgres -c 'create database counter'
git clone git@github.com:chico/temporality-counter.git
psql -d counter -a -f ./temporality-counter/sql/postgres/counter.sql
psql -d counter -c 'select * from counter'
```

## Database support

[Postgres](http://www.postgresql.org) is currently supported, more databases coming soon.

Please submit a new issue to fast track a database that you would like supported.

## Usage

### Increment counter

```javascript
var counter = require('temporality-counter');
var counterId = 'mysite-hit', counterType = 'web';

counter.incrementAndGet(counterId, counterType, counter.temporality.EVERY_MINUTE, function(err, count) {
	console.log(count);
});
```

### Get count

```javascript
var counter = require('temporality-counter');
var counterId = 'mysite-hit', counterType = 'web';

var lastHour = new Date();
lastHour.setHours(start.getHours()-1);

counter.count(counterId, lastHour, counter.temporality.EVERY_MINUTE, function(err, count) {
	console.log(count);
});

counter.countByIdAndType(counterId, counterType, lastHour, counter.temporality.EVERY_MINUTE, function(err, count) {
	console.log(count);
});
```

### Promises

If you prefer to use promises then please use [bluebird](https://github.com/petkaantonov/bluebird).

```
npm install bluebird -S
```

```javascript
var Promise = require('bluebird');
var counter = require('temporality-counter');
Promise.promisifyAll(counter);

var counterId = 'mysite-hit', counterType = 'web';

counter.incrementAndGetAsync(counterId, counterType, counter.temporality.EVERY_MINUTE).then(function(count) {
	console.log(count);
});

var lastHour = new Date();
lastHour.setHours(start.getHours()-1);

counter.countAsync(counterId, lastHour, counter.temporality.EVERY_MINUTE).then(function(count) {
	console.log(count);
});

counter.countByIdAndTypeAsync(counterId, counterType, lastHour, counter.temporality.EVERY_MINUTE).then(function(count) {
	console.log(count);
});

```

## Testing

```
npm install -g mocha
npm test
```

