# Temporality Counter

## Installation

The following will install [https://www.npmjs.org/package/temporality-counter](https://www.npmjs.org/package/temporality-counter) and add it as a dependency to your project:

```
npm install temporality-counter -S
```

## Database support

Postgres is currently supported, more databases coming soon.

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

counter.incrementAndGetAsync(counterId, counterType, counter.temporality.EVERY_MINUTE).then(count) {
	console.log(count);
});

var lastHour = new Date();
lastHour.setHours(start.getHours()-1);

counter.countAsync(counterId, lastHour, counter.temporality.EVERY_MINUTE).then(count) {
	console.log(count);
});

counter.countByIdAndTypeAsync(counterId, counterType, lastHour, counter.temporality.EVERY_MINUTE).then(count) {
	console.log(count);
});

```

## Testing

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
psql -d counter -a -f ./sql/postgres/counter.sql
psql -d counter -c 'select * from counter'
```

### Run test

```
npm install -g mocha
npm test
```

