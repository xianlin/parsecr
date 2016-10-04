var parsecr = require('./parsecr.js');

var minutes = 1, the_interval = minutes * 60 * 1000;

setInterval(function() {
  parsecr.run();
}, the_interval);

