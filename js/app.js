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

});

app.controller("UserCtrl", ["$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
    var ref2 = new Firebase("https://glowing-inferno-8009.firebaseio.com");
	var usersRef = ref2.child("users");
    $scope.authObj = $firebaseAuth(ref2);
	$scope.authData = $scope.authObj.$getAuth();
//Sign up
$scope.signUp = function (a, b) {
    if (a !== undefined && b !== undefined) {
        $scope.authObj.$createUser(a, b).then(function (userData) {
            $scope.logIn(a, b);
        }).then(function (authData) {
            var usertoPush = $scope.authObj.$getAuth();
            usersRef.child(usertoPush.uid).set({
				email: usertoPush.password.email,
                provider: usertoPush.provider,
                joined: new Date().getTime(),
				search_tokens: "0",
				search_terms: ""
            });
            $scope.signupmsg = "Account created successfully, you are now logged in!";
        }).catch(function (error) {
            $scope.signupmsg = error.message;
        });
    } else {
        $scope.signupmsg = "Please enter your user name and password.";
    };
};
//Log in	
$scope.logIn = function (a, b) {
    if (a !== undefined && b !== undefined) {
        $scope.authObj.$authWithPassword({
            email: a,
            password: b
        }).then(function (authData) {
            $scope.authData = $scope.authObj.$getAuth();
            $scope.loginmsg = "Login Success!";
        }).catch(function (error) {
            $scope.loginmsg = error.message;
        });
    } else {
        $scope.loginmsg = "Please enter your user name and password.";
    };
};
	//Log out
		$scope.logout = function() {
			$scope.authObj.$unauth();
			$scope.authData = $scope.authObj.$getAuth();
		};
	//Close Controller
  }
]);

//window resize for bg
function tellAngular() {
    var domElt = document.getElementById('city_skyline');
    scope = angular.element(domElt).scope();
    var distance = domElt.getBoundingClientRect().top;
    var fucker = window.innerHeight;
    
    var city_height = fucker - distance;
    console.log(city_height);

    scope.$apply(function() {
        domElt.style.height = city_height+"px";
    });

}

document.addEventListener("DOMContentLoaded", tellAngular, false);

//calling tellAngular on resize event
window.onresize = tellAngular;
