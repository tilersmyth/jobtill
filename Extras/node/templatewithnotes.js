var request = require('request');
var cheerio = require('cheerio');
//Our pretend firebase
var dummyFire = [];

//Start with the link to the jobs page
request('http://www.apperian.com/mobile-application-management-company/apperian-jobs/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var listCount = 0;
		//Find the job list element to repeat
        $('a[href*=#]').each(function (i, element) {
            listCount++;
			//Find the element containing the job position
            var role = "";
			//Find the element containing the job name
            var name = $(this).text();
			//Find the element containing the location
            var location = "Boston, MA";
			//Find the job url
            var url = "http://www.apperian.com/mobile-application-management-company/apperian-jobs/" + $(this).attr('href');
	        //Lets put all of the above info into an object
            var metadata = {
                name: name,
                role: role,
                url: url,
                location: location
            };
			//For each job object we push it into an array
            dummyFire.push(metadata);
        });
        console.log(dummyFire);
    };
});

//Once we figured out the elements to grab, we can put the information in here. This code can be copied to scrapevars.js
var sV = {
	//Company Name
    site: "Apperian",
	//Company url for job postings
    siteurl: "http://www.apperian.com/mobile-application-management-company/apperian-jobs/",
	//This is for multi page job listings. Default is "1"
    clean: "1",
	//The selector var used before ".each(function (i, element) {"
    sVar: "$('a[href*=#]')",
	//Vars used in the ".each" loop
    sitevars: 'name = "test"; location = "somewhere"; url = "here.com"; role = "pimp"'
}