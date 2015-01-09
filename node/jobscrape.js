var start = new Date().getTime();
var fs = require("fs")
var vm = require('vm')
var request = require('request');
var cheerio = require('cheerio');
var Firebase = require('firebase');
vm.runInThisContext(fs.readFileSync(__dirname + "/scrapevars.js"));
var iL = 0;
var totalJobs = 0;
var totalSites = 0;
var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
console.log("\nGathering Data...\n");

function scrapeAll() {
    if (iL < sV.length) {
        request(sV[iL].siteurl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                cRef = ref.child("/listings/" + sV[iL].site);
                if (sV[iL].clean === "1") {
                    cRef.remove();
                    totalSites++;
                };
                var $ = cheerio.load(html);
                var listCount = 0;
                var selector = eval(sV[iL].sVar);
                selector.each(function (i, element) {
                    listCount++;
                    totalJobs++;
                    eval(sV[iL].sitevars);
                    var metadata = {
                        name: name,
                        role: role,
                        url: url,
                        location: location
                    };

                    cRef.push(metadata);

                });
                console.log(sV[iL].site + " scraped: " + listCount + " entries");
                iL++;
                scrapeAll();
            };
        });
    } else {
        cRef = ref.child("LastScraped");
        cRef.set({
            lastRun: Date(),
            sites: totalSites,
            listings: totalJobs
        });
        var end = new Date().getTime();
        var time = (end - start) / 1000;
        var delayMe = totalSites * 1000;
        console.log('\nRun time: ' + time + ' seconds \nTotal Sites: ' + totalSites + '\nTotal Jobs: ' + totalJobs + '\n\n\nExiting...');
        setTimeout(function () {
            process.exit(code = 0);
        }, delayMe);
    };
};
scrapeAll();