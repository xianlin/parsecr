var CronJob = require('cron').CronJob;
var parsecr = require('./parsecr.js');


var job = new CronJob({
  cronTime: '0 * 7-23 * * *',
  onTick:  function() {
    parsecr.run();
  },
  start: true,
  timeZone: "Asia/Singapore"
});

job.start();
