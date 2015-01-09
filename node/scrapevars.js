var sV = [
{
site: "Apperian",
siteurl: "http://www.apperian.com/mobile-application-management-company/apperian-jobs/",
clean: "1",
sVar: "$('a[href*=#]')",
sitevars: 'var name = $(this).text(); var location = "Boston, MA"; var role = ""; var url = "http://www.apperian.com/mobile-application-management-company/apperian-jobs/"+ $(this).attr("href");'
},
{
site: "Buildium",
siteurl: "http://buildium.theresumator.com/",
clean: "1",
sVar: "$('.resumator-job-title')",
sitevars: ' var a = $(this).next().children().remove().end().text();var b = a.trim().split("\\n");if (typeof b[1] !== "undefined") {var role = b[1].trim();} else role = ""; var name = $(this).children("a").text(); var location = b[0].trim();var url = $(this).children("a").attr("href");'
},
{
site: "EverTrue",
siteurl: "http://www.evertrue.com/about-us/#career",
clean: "1",
sVar: "$('.careers div')",
sitevars: 'var role = "";var name = $(this).children("h3").text();var location = "Boston, MA";var url = $(this).children("p").children("a").attr("href");'
},
{
site: "Bullhorn",
siteurl: "http://www.bullhornreach.com/sites/bullhorn/?page=1",
clean: "1",
sVar: "$('.job-record')",
sitevars: 'var role = "";var name = $(this).children(".title").text().trim();var location = $(this).parent().parent().next().children(".joblocation").text();var url = "http://www.bullhornreach.com/" + $(this).parent().attr("href");'
},
{
site: "Bullhorn",
siteurl: "http://www.bullhornreach.com/sites/bullhorn/?page=2",
clean: "0",
sVar: "$('.job-record')",
sitevars: 'var role = "";var name = $(this).children(".title").text().trim();var location = $(this).parent().parent().next().children(".joblocation").text();var url = "http://www.bullhornreach.com/" + $(this).parent().attr("href");'
},
{
site: "Bullhorn",
siteurl: "http://www.bullhornreach.com/sites/bullhorn/?page=3",
clean: "0",
sVar: "$('.job-record')",
sitevars: 'var role = "";var name = $(this).children(".title").text().trim();var location = $(this).parent().parent().next().children(".joblocation").text();var url = "http://www.bullhornreach.com/" + $(this).parent().attr("href");'
},
{
site: "Localytics",
siteurl: "http://hire.jobvite.com/CompanyJobs/Careers.aspx?k=JobListing&c=qEO9Vfwg&v=1",
clean: "1",
sVar: "$('.joblist li')",
sitevars: 'var a=$(this).children("a").text();var jlink=$(this).children("a");var b=jlink.attr("onclick");var c=b.split("\'");var role=$(this).parent().prev("h3").text();var name=a.trim();var location=$(this).children(".joblocation").text();var url="http://hire.jobvite.com/CompanyJobs/Careers.aspx?c=qEO9Vfwg&v=1&page=Job%20Description&j="+c[5];'
},
{
site: "Optaros",
siteurl: "http://optaros.hrmdirect.com/employment/search.php?sort=da&search=true",
clean: "1",
sVar: "$('.reqResult div div a')",
sitevars: 'var role=$(this).parent().parent().prevUntil(".reqhead").prev().closest(".reqhead").text();var name=$(this).text();var location=$(this).parent().next("div").text();var url="http://optaros.hrmdirect.com/employment/"+$(this).attr("href").slice(0,-6)+"&#job";'
},
{
site: "SessionM",
siteurl: "http://www.sessionm.com/about-us/jobs/",
clean: "1",
sVar: "$('.job-list li')",
sitevars: 'var split=$(this).text().split("(");var role=split[0].slice(0,-4);var name=$(this).text();var location=split[1].slice(0,-2);var url=$(this).children("a").attr("href");'
},
{
site: "Skillz",
siteurl: "http://skillz.com/jobs",
clean: "1",
sVar: "$('.open-position')",
sitevars: 'var a=$(this).text();var b=a.split("\\n");var role=b[3].slice(26);var name=b[1].trim();var location=b[2].slice(24);var url=$(this).children("a").attr("href");'
},
{
site: "WordStream",
siteurl: "http://www.wordstream.com/jobs",
clean: "1",
sVar: "$('a[href*=\"/jobs/\"]')",
sitevars: 'var a=$(this).parent().prevUntil("h2").prev("h2").text();if(a===""){a=$(this).parent().prev("h2").text()}var role=a;var name=$(this).text();var location="Boston, MA";var url=$(this).attr("href");'
}
];

    