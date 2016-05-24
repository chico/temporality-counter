
var temporalities = require('./temporalities');

// Truncate date according to temporality, e.g.
// ALL_TIME: set to 01-01-1970 00:00:00
// DAILY: 01-01-1970 01:01:01 becomes 01-01-1970 00:01:00
// HOURLY: 01-01-1970 01:01:01 becomes 01-01-1970 01:00:00
// EVERY_MINUTE: 01-01-1970 01:01:01 becomes 01-01-1970 01:01:00
var truncateDate = function(date, temporality) {
  if (!temporalities.validate(temporality)) {
    return null;
  }
  date = (date) ? date : new Date();
  if (temporalities.ALL_TIME === temporality) {
    date = new Date(0);
  } else if (temporalities.DAILY === temporality) {
    date.setHours(0, 0, 0, 0);
  } else if (temporalities.HOURLY === temporality) {
    date.setMinutes(0, 0, 0);
  } else if (temporalities.EVERY_MINUTE === temporality) {
    date.setSeconds(0, 0);
  }
  return date;
}

module.exports = {
  truncateDate: truncateDate
}