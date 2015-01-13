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
                    console.log("Error creating user:", error);
                    $scope.$apply(function () {
                        $scope.loginmsg = "Error";
                    });
                }
            });
        } else {
            ref.authWithPassword({
                email: b,
                password: c
            }, function (error, authData) {
                if (error) {
                    $scope.$apply(function () {
                        $scope.loginmsg = "Incorrect user/pass";
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.loginmsg = "You have been logged in!";
                    });
                }
            });
        };

    } else {
        $scope.loginmsg = "Enter something dummy"
    };
};

});

