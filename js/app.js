var app = angular.module("Scrape", ["firebase", "ui.bootstrap"]);

//Firebase Link
app.controller("ScrapeCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
  var data = $firebase(ref.child('listings'));
  $scope.data = data.$asArray();
  var updated = $firebase(ref.child('LastScraped'));
  $scope.updated = updated.$asObject();
  $scope.comingSoon = 'Adding more cities soon';
  $scope.search_loc = 'Boston';

//date friendly view
  $scope.timeFunction = function(vartopass) {
   		var today = new Date();
   		var lastRun = new Date(vartopass);

   		if ((today.getDate()) == lastRun.getDate())
		return "today"

		if ((today.getDate()-1) == lastRun.getDate())
		return "yesterday"

  };
  
  //Login-Signup
$scope.processUser = function (a, b, c) {
    if (b !== undefined && c !== undefined) {
        if (a === "signup") {
            ref.createUser({
                email: b,
                password: c
            }, function (error) {
                if (error === null) {
                    $scope.$apply(function () {
                        $scope.loginmsg = "Account Created!";
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.loginmsg = error.message;
                    });
                };
            });
        } else {
            ref.authWithPassword({
                email: b,
                password: c
            }, function (error, authData) {
                if (error) {
                    var d = error.message;
                    var e = false;

                } else {
                    var d = "You have been logged in!";
                    var e = true;
                }
                $scope.$apply(function () {
                    $scope.loginmsg = d;
                    $scope.loggedIn = e;
                });
            });
        };

    } else {
        $scope.loginmsg = "Enter something dummy"
    };
};
//Logout
$scope.logOut = function () {
    ref.unauth();
    $scope.loggedIn = false;
};

});

