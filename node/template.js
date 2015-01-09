var request = require('request');
var cheerio = require('cheerio');
var dummyFire = [];

request('http://www.apperian.com/mobile-application-management-company/apperian-jobs/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var listCount = 0;
        $('a[href*=#]').each(function (i, element) {
            listCount++;
            var role = "";
            var name = $(this).text();
            var location = "Boston, MA";
            var url = "http://www.apperian.com/mobile-application-management-company/apperian-jobs/" + $(this).attr('href');
            var metadata = {
                name: name,
                role: role,
                url: url,
                location: location
            };
            dummyFire.push(metadata);
        });
        console.log(dummyFire);
    };
});

var sV = {
    site: "Apperian",
    siteurl: "http://www.apperian.com/mobile-application-management-company/apperian-jobs/",
    clean: "1",
    sVar: "$('a[href*=#]')",
    sitevars: 'name = "test"; location = "somewhere"; url = "here.com"; role = "pimp"'
}