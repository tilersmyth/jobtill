var request = require('request');
var cheerio = require('cheerio');
var dummyFire = [];

request('http://www.nanigans.com/jobs/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var listCount = 0;
        $('a.mbutton[href*="/jobs/"]').each(function (i, element) {
            listCount++;


            var a = $(this).prev().prev().text().slice(10);

            var role = "";
            var name = $(this).prev().prev().prev().text();
            var location = $(this).prev().prev().text().slice(10);;
            var url = $(this).attr("href");
            var metadata = {
                name: name,
                role: role,
                url: url,
                location: location
            };
            dummyFire.push(metadata);
            console.log(a);
        });
        //console.log(a);
    };
});

var sV = {
    site: "Nanigans",
    siteurl: "http://www.nanigans.com/jobs/",
    clean: "1",
    sVar: "$('a.mbutton[href*=\"/jobs/\"]')",
    sitevars: 'var role="";var name=$(this).prev().prev().prev().text();var location=$(this).prev().prev().text().slice(10);var url=$(this).attr("href");'
}



//1. clear out vars
//2. look for starting point
//3. Put identifier in sVar quotes
//4. After vars are found, copy vars and compress - make sure all double quotes (if single quotes are required then escape)
//5. c/p compressed code into sitevars 
//6. Copy object (including brackets) and paste into scrapevars.js
