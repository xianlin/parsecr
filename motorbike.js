var cheerio = require('cheerio');
var request = require('request');
var nodemailer = require('nodemailer');

require('dotenv').config();


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
    blacklistArr = [""];
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

var motorbike = function(cb){
    request({
        method: 'GET',
        url: 'https://carousell.com/search/products?query=honda%20750&collection_id=108&price_start=8000&price_end=30000&sort=recent'
    }, function(err, response, body) {
        if (err) return console.error(err);

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
            if (checkStr(productTitle,"nc750x") && checkStr(productTitle,"honda")
                &&  !blacklist(publisher) && !inHistory(productURL)) {
                obj.title = productTitle;
                obj.url = productURL;
                obj.imageUrl = productImageUrl;
                obj.price = productPrice;
                obj.user = publisher;
                obj.time = publishedTime;
                result.push(obj);
                productHistoryArr.push(productURL);
            }

            // delete last item if array reach 5 elements
            if (productHistoryArr.length === 5) {
                productHistoryArr.splice(4, 1);
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
            subject: 'Found Your Motorbike', // Subject line
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
        console.log("No Motorbikes Found");
    } else {
        console.log(content);
    }
};


exports.run = function() {
  motorbike(sendEmail);
};

