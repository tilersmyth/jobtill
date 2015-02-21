var app = angular.module("Scrape", ["firebase", "ui.bootstrap",'angulartics', 'angulartics.google.analytics', 'ngtimeago','timer','ui.router']);
//Router
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "templates/main.html"
        })
        .state('howitworks', {
            url: "/thehow",
            templateUrl: "templates/howitworks.html"
        })
        .state('settings', {
            url: "/settings",
            templateUrl: "templates/settings.html"
        })
});
//Factory
app.factory('UserDataStorage', function(){
    return {
        data: "",
        loading: true,
        update: function(a) {
            this.data = a;
        },
        isLoading: function(a) {
            this.loading = a;
        }
    };
});

//Email Verification
app.factory('postEmailForm', function($http) {
    return {
        postEmail: function(data) {
            $http.post("http://168.235.70.242:3000/postEmail", data).success(function() {
                console.log("Success")
            });
        }
    }
});
app.filter('jobsFilter', function($rootScope) {
    return function( items, a ) {
        var splitter = Math.round(items.length * a);
        if (a !== 1) {
            splitter = (splitter < 40) ? splitter : 40;
        }
        var filtered = [];
        var outC = 0;
        var inC = 0;
        angular.forEach(items, function(item) {
            if(inC < splitter ) {
                filtered.push(item);
                inC++;
            } else outC++;
        });
        $rootScope.hiddenPosts = outC;
        return filtered;
    };
});
app.filter('unlockedFilter', function() {
    return function( items, a) {
        var keys = a.unlocked;
        var time = new Date().getTime();
        var filtered = [];
        angular.forEach(items, function(item) {
            if (keys) {
                var keymatch = keys.match(item.jobId);
            }
            if (keymatch) {
                item.unlocked = true;
            } else {
                var diff = Math.round(((time - item.created)/3.6e+6));
                var remaining = (48-diff)*3600;
                var price = "1.30";
                if (diff < 25 && diff > 12){
                    price="1.00";
                } else if (diff < 37 && diff > 24){
                    price=".90";
                }else if (diff > 36){
                    price=".50";
                }
                price = !keys?0:price;
                item.price = price;
                item.timeleft = remaining;
                item.unlocked = false;
            }
            if (remaining<=0) {
                item.status = "old";
            }
            filtered.push(item);
        });
        return filtered;
    };
});
app.filter('notifications', function($rootScope) {
    return function( items, a) {
            var count = 0;
            var keys = a[0];
            var viewed = a[1];
            var filtered = [];
            //Default to Boston
            var loc = 'Boston';
            angular.forEach(items, function (item) {
                if (keys) {
                    var keymatch = keys.match(item.jobId);
                }
                if (!keymatch) {
                    if (item.status === 'new' && item.location.indexOf(loc) > -1) {
                        var was_viewed = viewed?viewed.match(item.jobId):false;
                        filtered.push(item);
                        count = was_viewed?count:count+=1;
                        item.never_seen = was_viewed?false:true;
                    }
                }
            });
            if (a[0] !== 'loading') {$rootScope.notification_count = count; $rootScope.notifs_data = filtered;}
            return filtered;

    };
});

