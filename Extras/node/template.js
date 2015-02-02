var request = require('request');
var cheerio = require('cheerio');


request('http://www.anaqua.com/about-anaqua/careers.html', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var listCount = 0;
        $("u:contains(\"United\")").parent().siblings("a").each(function (i, element) {
            listCount++;

            var a = $(this).text().slice(2);
		   
 
            var name = $(this).text().slice(2);
            var location = "Boston, MA";			
            var url = "http://www.anaqua.com/about-anaqua/"+ $(this).attr("href");
			
			console.log(a);
        });
        
    };
});
