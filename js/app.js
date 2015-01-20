var app = angular.module("Scrape", ["firebase", "ui.bootstrap"]);
//Email Verification
app.factory('postEmailForm', ['$http', function($http) {
    return {
        postEmail: function(data) {
            console.log(data);
            $http.post("http://168.235.70.242:3000/postEmail", data).success(function() {
                console.log("yay")
            });
        }
    }
}]);
//Global for body style
app.run(function($rootScope) {
        $rootScope.bodyStyle = {
            overflow: "hidden"
        };
    })
    //Firebase Link
app.controller("ScrapeCtrl", function($scope, $rootScope, $firebase) {
    var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
    var data = $firebase(ref.child('listings'));
    $scope.data = data.$asArray();
    var updated = $firebase(ref.child('LastScraped'));
    $scope.updated = updated.$asObject();
    $scope.comingSoon = 'Adding more cities soon';
    $scope.search_loc = 'Boston';
    //Set body style 
    $scope.checkPut = function() {
        $rootScope.bodyStyle = ($scope.search.length > 0) ? {
            overflow: "auto"
        } : {
            overflow: "hidden"
        };
    };
    //date friendly view
    $scope.timeFunction = function(vartopass) {
        var today = new Date();
        var lastRun = new Date(vartopass);

        if ((today.getDate()) == lastRun.getDate())
            return "today"

        if ((today.getDate() - 1) == lastRun.getDate())
            return "yesterday"

    };

});

app.controller("UserCtrl", ["$scope", "$firebaseAuth", "$firebase", "postEmailForm",
    function($scope, $firebaseAuth, $firebase, postEmailForm) {
        var ref2 = new Firebase("https://glowing-inferno-8009.firebaseio.com");
        var usersRef = ref2.child("users");
        //Get validated emails
        var setEmails = [];
        usersRef.once('value', function(userSnapshot) {
            var userSnap = userSnapshot.val();
            for (key in userSnap) {
                setEmails.push(userSnap[key].email);
            };
        });


        $scope.authObj = $firebaseAuth(ref2);
        $scope.authData = $scope.authObj.$getAuth();
        if ($scope.authData !== null) {
            var userInfo = $firebase(usersRef.child($scope.authData.uid));
            $scope.userData = userInfo.$asObject();
        };
        //clear validation text on dropdown close
        $scope.toggled = function(open) {
            if (!open) {
                $scope.signupmsg = "";
                $scope.loginmsg = "";

                var defaultLogin = {
                    loginMail: "",
                    loginPass: ""
                };
                $scope.loginForm = defaultLogin;
                $scope.loginFormCont.$setPristine();

                var defaultSignup = {
                    firstName: "",
                    lastName: "",
                    signupMail: "",
                    signupPass: "",
                    signupPass2: ""
                };
                $scope.signupForm = defaultSignup;
                $scope.signupFormCont.$setPristine();
            }
        };
        //Sign up
        $scope.signUp = function(a) {
            for (var i = 0; i < setEmails.length; i++) {
                if (a.signupMail === setEmails[i]) {
                    emailsGood = false;
                    $scope.signmsg = "The email address is already in use."
                    break;
                } else {
                    emailsGood = true;
                };
            };
            if (emailsGood) {
                if (a.signupPass !== a.signupPass2) {
                    $scope.signmsg = "Passwords do not match!"
                } else {
                    $scope.signmsg = "Please check your email for the verification link!";
                    $scope.pendingSignup = true;
                    //postEmailForm.postEmail({email: a, password: b,firstName: c,lastName: d});
                };
            };
        };
        //Create account with email verification
        $scope.signUp2 = function(a, b, c, d) {
            if (a !== undefined && b !== undefined) {
                $scope.authObj.$createUser({
                    email: a,
                    password: b
                }).then(function(userData) {
                    return $scope.authObj.$authWithPassword({
                        email: a,
                        password: b
                    });
                }).then(function(authData) {
                    $scope.authData = $scope.authObj.$getAuth();
                    var userInfo = $firebase(usersRef.child($scope.authData.uid));
                    $scope.userData = userInfo.$asObject();
                    var usertoPush = $scope.authObj.$getAuth();
                    usersRef.child(usertoPush.uid).set({
                        firstName: c,
                        lastName: d,
                        email: usertoPush.password.email,
                        provider: usertoPush.provider,
                        joined: new Date().getTime(),
                        search_tokens: "0",
                        search_terms: ""
                    });
                    $scope.status.isopen = !$scope.status.isopen;
                }).catch(function(error) {
                    console.error("Error: ", error);
                });
            } else {
                $scope.signupmsg = "Please enter username and password.";
            };
        };

        //Log in	
        $scope.logIn = function(a, b) {
            if (a !== undefined && b !== undefined) {
                $scope.authObj.$authWithPassword({
                    email: a,
                    password: b
                }).then(function(authData) {
                    $scope.authData = $scope.authObj.$getAuth();
                    var userInfo = $firebase(usersRef.child($scope.authData.uid));
                    $scope.userData = userInfo.$asObject();
                    $scope.loginmsg = "Login Success!";
                    $scope.status.isopen = !$scope.status.isopen;
                }).catch(function(error) {
                    $scope.loginmsg = error.message;
                });
            } else {
                $scope.loginmsg = "Please enter username and password.";
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