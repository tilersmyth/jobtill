var request = require('request');
var cheerio = require('cheerio');


request('https://otelic.com/quanttus/jobs', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var listCount = 0;
        $(".job-title a").each(function (i, element) {
            listCount++;

           var a = $(this).parent().prev().text().trim();
		   
 
            var name = $(this).text();
            var location = $(this).children('.jobTeaser').children('strong').text().split("-")[1]?$(this).children('.jobTeaser').children('strong').text().split("-")[1].trim():"Boston, MA";		
            var url = $(this).children('.jobBtn').children('a').attr('href');


			console.log(a);
        });
        
    };
});
