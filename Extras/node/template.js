var request = require('request');
var cheerio = require('cheerio');


request('http://www.digitallumens.com/company/careers/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var listCount = 0;
        $(".career").each(function (i, element) {
            listCount++;

           var a = $(this).children().children().attr('href');
		   
 
            var name = $(this).children().children().children('strong').text();
            var location = "Boston, MA";		
            var url = $(this).children().children().attr('href');


			console.log(a);
        });
        
    };
});
