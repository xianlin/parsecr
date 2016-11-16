var CronJob = require('cron').CronJob;
var iphone = require('./iphone.js');
var sendMail = require('./sendMail.js');

require('dotenv').config();

var job = {};

const msg = "iPhone Jet Black 128GB Not Found";

if (process.env.NODE_ENV === "production") {

  console.log("production phase, don't make any mistakes...");

  job = new CronJob({
    cronTime: '00 05 9,15,18 * * *',
    onTick:  function() {
      iphone.find(process.env.M1_WEBSITE, function(err, data){
        if (err) return console.log(err);

        if (data.result.length > 0) {
          sendMail.send(data.result);
        } else {
          console.log(data.time + ": " + msg);
        }

      });
    },
    start: true,
    timeZone: "Asia/Singapore"
  });
} else {

  console.log("development phase, good luck...");

  job = new CronJob({
    cronTime: '*/5 * * * * *',
    onTick:  function() {
      iphone.find(process.env.M1_WEBSITE, function(err, data){
        if (err) return console.log(err);

        console.log(data.time + ": " + JSON.stringify(data.result));

        // for testing purpose
        // if (data.result.length > 0) {
        //   sendMail.send(data.result);
        // } else {
        //   console.log(data.time + ": " + msg);
        // }
      });
    },
    start: true,
    timeZone: "Asia/Singapore"
  });
}

job.start();
