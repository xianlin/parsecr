var cheerio = require('cheerio');
var request = require('request');

request({
    method: 'GET',
    url: 'https://carousell.com/search/products/?query=iphone%207%20plus&price_end=1500&condition=new&price_start=500'
}, function(err, response, body) {
    if (err) return console.error(err);

    // Tell Cherrio to load the HTML
    var $ = cheerio.load(body);
    $('.card.pdt-card').each(function(i, element) {
        var productURL = $(this).children('.pdt-card-img').children('.pdt-card-thumbnail').attr('href');
        var productTitle = $(this).children('.pdt-card-caption').children('.pdt-card-title').text();
        console.log(productTitle);
    });
});
