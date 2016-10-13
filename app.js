var CronJob = require('cron').CronJob;
var diaper = require('./diaper.js');
var motorbike = require('./motorbike.js');

var job = {};

if (process.env.NODE_ENV === "production") {
	job = new CronJob({
	  cronTime: '0 */15 7-23 * * *',
	  onTick:  function() {
	    diaper.run();
	    motorbike.run();
	  },
	  start: true,
	  timeZone: "Asia/Singapore"
	});
} else {
	job = new CronJob({
	  cronTime: '*/3 * 7-23 * * *',
	  onTick:  function() {
	    diaper.run();
	    motorbike.run();
	  },
	  start: true,
	  timeZone: "Asia/Singapore"
	});
}

job.start();
