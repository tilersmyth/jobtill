var app = angular.module("editor", ["firebase", 'ui.bootstrap']);

app.controller("EditCtrl", function($scope, $firebase, $firebaseAuth, $timeout) {
    var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.getCont = function(a) {
        $scope.loaded = a;
    };
    $scope.searchVar = "all";

    $scope.addnewComp = function(a, b) {
        $scope.addcompMSG = "Company has been added!";
        this.addcomp = "";
        b.$setPristine();
        var metadata = {
            site: a.site,
            siteurl: a.siteurl,
            multi: eval(a.mp),
            msLead: a.mplead,
            msVar: a.mpvar,
            sVar: a.svar,
            sitevars: a.name + a.location + a.url
        };
        scrapeInject.push(metadata);
        $timeout(function() {
            $scope.addcompMSG = "";
        }, 2000);
    };
    $scope.searchbyJob = function(a, b) {
        switch (a) {
            case "site":
                $scope.searchingBy = {
                    site: b
                };
                break;
            case "name":
                $scope.searchingBy = {
                    name: b
                };
                break;
            case "status":
                $scope.searchingBy = {
                    status: b
                };
                break;
            default:
                $scope.searchingBy = b;
        }
    };
    var scrapeInject;
    var connectFirebase = function() {
        var jobref = $firebase(ref.child('listings'));
        $scope.items = jobref.$asArray();
        var siteref = $firebase(ref.child('scrape-vars'));
        $scope.getsites = siteref.$asArray();
        //User Data Stats
        var userref = ref.child('users');
        scrapeInject = ref.child('scrape-vars');
        userref.once('value', function(usersnap) {
            var i = 0;
            var totalUnlocked = 0;
            var totalUsersUnlocked = 0;
            var userTerms = "";
            var userLoc = "";
            usersnap.forEach(function(snap) {
                var unlocked = snap.child('unlocked').val();
                var terms = snap.child('search_terms').val();
                var location = snap.child('search_location').val();
                if (terms) {
                    if (userTerms === "") {
                        userTerms = terms;
                    } else {
                        userTerms = userTerms + "," + terms;
                    }
                }
                if (location) {
                    if (userLoc === "") {
                        userLoc = location;
                    } else {
                        userLoc = userLoc + "," + location;
                    }
                }
                if (unlocked) {
                    var split = unlocked.split(",");
                    unlocked = split.length;
                    totalUsersUnlocked++;
                } else unlocked = 0;
                i++;
                totalUnlocked = totalUnlocked + unlocked;
            });
            $scope.userCount = i;
            $scope.userTerms = userTerms;
            $scope.userLoc = userLoc;
            $scope.usersUnlocked = totalUsersUnlocked;
            $scope.totalUnlocked = totalUnlocked;

        });
        //Site Data Stats
        var lastref = $firebase(ref.child('LastScraped'));
        $scope.lastrun = lastref.$asObject();
    };
    $scope.authData = $scope.authObj.$getAuth();
    if ($scope.authData) {
        if ($scope.authData.uid === "simplelogin:79" || $scope.authData.uid === "simplelogin:80") {
            $scope.loggedIn = true;
            connectFirebase();
        }
    }
    $scope.logIn = function(a) {
        $scope.authObj.$authWithPassword({
            email: a.a,
            password: a.b
        }).then(function() {
            $scope.authData = $scope.authObj.$getAuth();
            if ($scope.authData.uid === "simplelogin:79" || $scope.authData.uid === "simplelogin:80") {
                $scope.loginmsg = "";
                $scope.loggedIn = true;
                connectFirebase();
            } else {$scope.loginmsg = "Login Failed";}
        }).catch(function(error) {
            $scope.loginmsg = error.message;
        });
    };
    $scope.logout = function() {
        $scope.authObj.$unauth();
        $scope.loggedIn = false;
        $scope.loaded = "";
    };
});