var request = require('request');
var cheerio = require('cheerio');


request('http://careers.draftkings.com/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var listCount = 0;
        $(".resumator-job-title a").each(function (i, element) {
            listCount++;

            var a = $(this).parent().next().text().trim().split(":")[1];
		   
 
            var name = $(this).text();
            var location = "Boston, MA";			
            var url = $(this).attr('href');
			
			console.log(a);
        });
        
    };
});
