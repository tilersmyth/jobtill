app.controller("ScrapeCtrl", function($scope, $firebase, $window, $timeout,$http,UserDataStorage) {

    //Firebase Link
    var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
    var data = $firebase(ref.child('listings'));
    var snapdata = ref.child('listings');
    $scope.data = data.$asArray();
    var updated = $firebase(ref.child('LastScraped'));
    $scope.updated = updated.$asObject();

    $scope.testData = UserDataStorage.data;
    $scope.$watch(function () { return UserDataStorage.data; }, function (a) {
        if (a) $scope.testData = a;
        $scope.loading = UserDataStorage.loading;

    });
    $scope.loading = UserDataStorage.loading;
    //Jumbotron Vars
    $scope.search_loc = 'Boston';

    //initialize search var
    $scope.search = '';

    //timer countdown
    $scope.timerRunning = true;
    $scope.currentTime = new Date().getTime();

    $scope.locWarn = function () {
        var a = this.search_loc.toLowerCase();
        $scope.loc_warn = (a !== "boston");
    };

    //Set sky height
    var device = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    if (device !== null) {
        var macAttack = -30;
    }
    $scope.onResize = function() {
        var skyline = document.getElementById("city_skyline");
        var skyset = skyline.offsetTop;
        var h = window.innerHeight;
        var ifL;
        if (macAttack < 0) {
            ifL = macAttack;
        } else  { ifL = -1;}
        var newh = h - skyset + ifL;
        $timeout(function(){
            $scope.skyHeight = {
                height: newh,
                overflow: "hidden"
            }
        });
    };
    $timeout(function(){$scope.onResize()});
    angular.element($window).bind('resize', function() {
        $scope.onResize();
    });
    //Check if user is logged in
    $scope.$on('userOn', function(event, data) {
        $scope.loggedIn = data;
        $scope.jobKeys = data;
        if (!data) {
            $scope.showJobs = .4;
            $scope.loading = false;
        } else {
            $scope.showJobs = 1;
            //$scope.loading = false;
            //Send post data to userctrl
            $scope.$broadcast('user_notifs', $scope.data);
        }

    });
    //Get unlock codes
    $scope.jobKeys = "";
    $scope.$on('unlock_keys', function(event, data) {
        $scope.jobKeys = data;
    });
    //Get notif search
    $scope.$on('notif_search', function(event, a) {
        $scope.search = a;
    });
    $scope.openSignup = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.$broadcast('toggleSignup', true);
    };
    //Unlock job
    var handler = StripeCheckout.configure({
        key: 'pk_live_hcLnoSaVl36UrTy7JwYQegFM',
        token: function(token) {
            var postData = {
                token: token,
                price: $scope.jobprice
            };
            var data = $scope.loggedIn;
            if ($scope.jobprice === 0) {
                $scope.$broadcast('unlock_job', $scope.jobToken,data.$id,data.unlocked);
                console.log("free job");
            }else {
                $http.post("http://168.235.70.242:3000/unlock_job", postData).success(function(a) {
                    console.log(a);
                    $scope.$broadcast('unlock_job', $scope.jobToken,data.$id,data.unlocked);
                });
            }

        }
    });
    $scope.unlockJob = function(id,name,price) {
        var data = $scope.loggedIn;
        if (data.admin) {
            $scope.$broadcast('unlock_job', id,data.$id,data.unlocked);
        } else {
            price *= 100;
            var msg = (price === 0) ? "First one is free!" : "Unlock Job For";
            handler.open({
                name: "Job Description",
                description: name,
                amount: price,
                panelLabel: msg
            });
            $scope.jobToken = id;
            $scope.jobprice = price;
        }
    };
});


//How it works modal
app.controller('HiwModal', function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

});//End How it works modal

//new Job alert controller
app.controller('AlertsModal', function ($scope, $modalInstance, items, $rootScope) {

    $scope.userInfo = items.user;
    $scope.jobSearch = {
        term: items.user.search_terms,
        location: items.user.search_location
    };
    $scope.ok = function (a) {
        $modalInstance.dismiss('cancel');
        $rootScope.$broadcast('save_search_data', a);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});//End new Job alert controller
