var start = new Date().getTime();
var request = require('request');
var cheerio = require('cheerio');
var Firebase = require('firebase');
var sV = [];
var iL = 0;
var totalJobs = 0;
var totalSites = 0;
var newJobs = 0;
var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
var datatoCompare = [];
ref.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key();
        if (key === "listings") {
            var childData = childSnapshot.val();
            for (obj in childData) {
                dRef = ref.child("/listings/" + obj).once("value", function (snapshot) {
                    datatoCompare.push(snapshot.val());
                });
            };		
        };
		if (key === "scrape-vars") {
			        var childData2 = childSnapshot.val();
            for (obj in childData2) {
                dRef = ref.child("/scrape-vars/" + obj).once("value", function (snapshot) {
                    sV.push(snapshot.val());
                });
            };
		};
    });
});
cRef = ref.child("/listings");
console.log("\nGathering Data...\n");

function scrapeAll() {
    if (iL < sV.length) {
        request(sV[iL].siteurl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                if (sV[iL].clean === "1") {
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
                        site: sV[iL].site,
                        url: url,
                        location: location,
                        created: new Date().getTime(),
						status: "new"
                    };
                    compareData(metadata);
                });
                console.log(sV[iL].site + " scraped: " + listCount + " entries");
                iL++;
                scrapeAll();
            }else {console.log(sV[iL].site + " is down. Moving on... "); iL++; scrapeAll();};
        });
    } else {
        cRef = ref.child("LastScraped");
        cRef.set({
            lastRun: new Date().getTime(),
            sites: totalSites,
            listings: totalJobs,
			newjobs: newJobs
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
setTimeout(function () {
   cRef.remove(); scrapeAll();
}, 4000);

function compareData(a) {
    var isPresent;
    var foundI = 0;
    for (var z = 0; z < datatoCompare.length; z++) {
        if (datatoCompare[z].url === a.url) {
            isPresent = true;
            foundI = z;
            break
        } else {
            isPresent = false;
        };
    };
    if (isPresent) {
        var metadata = {
            name: datatoCompare[foundI].name,
            site: datatoCompare[foundI].site,
            url: datatoCompare[foundI].url,
            location: datatoCompare[foundI].location,
            created: new Date().getTime(),
			status: "old"
        };
		cRef.push(metadata);
    } else {
		newJobs++;
        cRef.push(a)
    };
}