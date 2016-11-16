const cheerio = require('cheerio');
const request = require('request');

// IPhone stock ASCII Code in Integer, after convert from symbol
const gotStockCode = 10003;
const noStockCode = 8211;

var find = function(webUrl, callback){
    request({
        method: 'GET',
        url: webUrl
    }, function(err, response, body) {
        if (err) return callback(err);

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

            // The model is iphone 128GB JetBlack in this case and range from 323 to 335 row
            // console.log("number " + i + " :" + temp);
            if (i >= 323 && i <= 335) {
                stockArr.push(temp);
            }
        });
	console.log("iPhone 128GB JetBlack: " + stockArr);

        // convert char to ACSII code and compare since the stock symbole are difficult to type
        // add the store name with the iphone stock to the result array
        var storeGotstockArr = [];
        stockArr.forEach(function(element, index){
            if (element.charCodeAt(0) === gotStockCode) {
                storeGotstockArr.push(storeArr[index]);
            }
        });

        var data = {};
        var now = new Date();
        data.time = now;
        data.result = storeGotstockArr;
        return callback(null, data);
    });
};


exports.find = find;

