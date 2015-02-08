fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

//Add nyud.net to the squarespace site followed by the dir (see below)
//Use original url when appending to var url
//See below: Original site = http://www.ntoggle.com/careers/


request('http://www.ntoggle.com.nyud.net/careers/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);   		
        $(".sqs-block-content ul li a").each(function (i, element) {                        
			
                        var a = $(this).text(); 
 
			var name = $(this).text();
			var location = "Boston, MA";
                        var url = "http://www.ntoggle.com"+$(this).attr('href');
			

			console.log(a);
        });     
    } else {console.log(error);} ;
});
