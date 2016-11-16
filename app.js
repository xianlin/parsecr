const CronJob = require('cron').CronJob;
const diaper = require('./diaper.js');
const motorbike = require('./motorbike.js');

require('dotenv').config();

var job = {};

const msgDiaper = "Diaper Not Found";
const msgBike = "Motorbike Not Found";

if (process.env.NODE_ENV === "production") {
  job = new CronJob({
    cronTime: '0 */15 7-23 * * *',
    onTick:  function() {

      diaper.find(process.env.DIAPER_URL, function(err, data){
        if (err) return console.log("Diaper find error: " + err);

        if (data.result.length > 0){
          sendMail.send(data.result);
        } else {
          console.log(data.time + ": " + msgDiaper)
        }

      });

      motorbike.find(process.env.MOTORBIKE_URL, function(err, data){
        if (err) return console.log("Motorbike find error: " + err);

        if (data.result.length > 0){
          sendMail.send(data.result);
        } else {
          console.log(data.time + ": " + msgBike)
        }

      });

    },
    start: true,
    timeZone: "Asia/Singapore"
  });
} else {
  console.log("development phase, good luck");
  job = new CronJob({
    cronTime: '*/5 * 7-23 * * *',
    onTick:  function() {

      diaper.find(process.env.DIAPER_URL, function(err, data){
        if (err) return console.log("Diaper find error: " + err);

        if (data.result.length > 0){
          console.log(data.time + ": " + JSON.stringify(data.result));
        } else {
          console.log(data.time + ": " + msgBike)
        }


      });

      motorbike.find(process.env.MOTORBIKE_URL, function(err, data){
        if (err) return console.log("Motorbike find error: " + err);

        if (data.result.length > 0){
          console.log(data.time + ": " + JSON.stringify(data.result));
        } else {
          console.log(data.time + ": " + msgDiaper)
        }

      });

    },
    start: true,
    timeZone: "Asia/Singapore"
  });
}

job.start();
