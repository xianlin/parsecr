const cheerio = require('cheerio');
const request = require('request');
const nodemailer = require('nodemailer');

var checkStr = function(str, word) {
    var lowerCaseStr = str.toLowerCase();
    var lowerCaseWord = word.toLowerCase();
    if (lowerCaseStr.indexOf(lowerCaseWord) === -1) {
        return false;
    } else {
        return true;
    }
};

var blacklist = function(username) {
    blacklistArr = ["radiant_city_services", "champ168", "miaomiao3", "sheryl83"];
    if (blacklistArr.indexOf(username) > -1) {
        //In the array!
        return true;
    } else {
        //Not in the array
        return false;
    }
};

var productHistoryArr = [];

var inHistory = function(record) {

    if (productHistoryArr.indexOf(record) > -1) {
        //In the array!
        return true;
    } else {
        //Not in the array
        return false;
    }
};

var find = function(webUrl, callback){
    request({
        method: 'GET',
        url: webUrl
    }, function(err, response, body) {
        if (err) return callback(err);

        // Tell Cherrio to load the HTML
        var $ = cheerio.load(body);

        var result = [];

        $('.card.pdt-card').each(function(i, element) {
            var productURL = $(this).children('.pdt-card-img').children('.pdt-card-thumbnail').attr('href');
            var productTitle = $(this).children('.pdt-card-caption').children('.pdt-card-title').text();
            productURL = "https://carousell.com" + productURL.replace(/\/\?rank.*$/g, '')

            var productImageUrl = $(this).children('.pdt-card-img').children('.pdt-card-thumbnail').children('img').attr('data-layzr');
            var productPrice = $(this).children('.pdt-card-caption').children('.pdt-card-attr').children('.pdt-card-price').attr('title');
            productPrice = productPrice.replace(/\$/g, '');

            var a = $(this).children('.pdt-card-caption').children('div').children('.pdt-card-seller').children('.media-body');
            var publisher = a.children('.pdt-card-username').text();
            var publishedTime = a.children('time.pdt-card-timeago').children('span').text();

            var obj = {};

            // Add to array only if conditions are met
            // Cannot be pants
            if (!checkStr(productTitle,"pant") && !checkStr(productTitle,"pants")
                && !checkStr(productTitle,"Merries") && !checkStr(productTitle,"Drypers")
                &&  !blacklist(publisher) && !inHistory(productURL)) {
                // if carton sale (3 pc), cannot over $50
                if (checkStr(productTitle, "carton") && (productPrice <= 50)) {
                    obj.title = productTitle;
                    obj.url = productURL;
                    obj.imageUrl = productImageUrl;
                    obj.price = productPrice;
                    obj.user = publisher;
                    obj.time = publishedTime;
                    result.push(obj);
                    productHistoryArr.push(productURL);
                } else if (!checkStr(productTitle, "carton")) {
                    obj.title = productTitle;
                    obj.url = productURL;
                    obj.imageUrl = productImageUrl;
                    obj.price = productPrice;
                    obj.user = publisher;
                    obj.time = publishedTime;
                    result.push(obj);
                    productHistoryArr.push(productURL);
                }
            }

            // delete last item if array reach 5 elements
            if (productHistoryArr.length === 5) {
                productHistoryArr.splice(4, 1);
            }

        });

        var data = {};
        data.time = new Date();
        data.result = result;

        return callback(null, data);
    });
};

exports.find = find;

