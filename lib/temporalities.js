
var temporalities = {
  ALL_TIME: 'ALL_TIME',
  DAILY: 'DAILY',
  HOURLY: 'HOURLY',
  EVERY_MINUTE: 'EVERY_MINUTE'
};

var keys = Object.keys(temporalities);

temporalities.validate = function(temporality) {
	return (temporality && keys.indexOf(temporality) >= 0);
};

module.exports = temporalities;