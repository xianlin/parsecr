var cheerio = require('cheerio');
var request = require('request');
var nodemailer = require('nodemailer');

require('dotenv').config();

// IPhone stock ASCII Code in Integer, after convert from symbol
const gotStockCode = 10003;
const noStockCode = 8211;


var iphone = function(cb){
    request({
        method: 'GET',
        url: process.env.M1_WEBSITE
    }, function(err, response, body) {
        if (err) return console.error(err);

        // Tell Cherrio to load the HTML
        var $ = cheerio.load(body);

        // the table head "th" contains m1 store names and we add those names to the array
        var storeArr = [];
        $('.stock th').each(function(i, element){
            var temp = $(element).text().replace(/\s/g,'');
            if (temp.length) {
                storeArr.push(temp);
            }
        });

        // the specific model result is located at the specific row number of the
        // below output, we will check the stock status and add the stock to the array
        var stockArr = [];
        $('.stock td').each(function(i, element){
            var temp = $(element).text();

            // The model is iphone 128GB JetBlack in this case and range from 295 to 307 row
            // console.log("number " + i + " :" + temp);
            if (i >= 323 && i <= 335) {
                stockArr.push(temp);
            }
        });

        // convert char to ACSII code and compare since the stock symbole are difficult to type
        // add the store name with the iphone stock to the result array
        var result = [];
        stockArr.forEach(function(element, index){
            if (element.charCodeAt(0) === gotStockCode) {
                result.push(storeArr[index]);
            }
        });

        cb(result);
    });
};

var sendEmail = function(content) {
    if (content.length && process.env.NODE_ENV === 'production') {
        // create reusable transporter object using the default SMTP transport
        // var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
        var transporter = nodemailer.createTransport(process.env.SMTP_GMAIL);

        // setup e-mail data with unicode symbols
        var mailOptions = {
            to: process.env.EMAIL, // list of receivers
            subject: 'Found Your Iphone', // Subject line
            text:  JSON.stringify(content)// html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            var d = new Date();
            console.log(d.toISOString() + ' Message sent: ' + info.response);
        });
    } else if (content.length === 0) {
        console.log("No Iphone Found");
    } else {
        console.log(JSON.stringify(content));
    }
};



exports.run = function() {
  iphone(sendEmail);
};

