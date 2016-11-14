var CronJob = require('cron').CronJob;
var iphone = require('./iphone.js');

var job = {};

if (process.env.NODE_ENV === "production") {
	job = new CronJob({
	  cronTime: '00 05 9,15,18 * * *',
	  onTick:  function() {
	    iphone.run();
	  },
	  start: true,
	  timeZone: "Asia/Singapore"
	});
} else {
	job = new CronJob({
	  cronTime: '*/2 * * * * *',
	  onTick:  function() {
	    iphone.run();
	  },
	  start: true,
	  timeZone: "Asia/Singapore"
	});
}

job.start();
