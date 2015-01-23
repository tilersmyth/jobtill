var app = angular.module("Scrape", ["firebase", "ui.bootstrap"]);
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
        var filtered = [];
        var outC = 0;
        angular.forEach(items, function(item) {
            if( item.created >= a[0] && item.created <= a[1] ) {
                filtered.push(item);
            } else outC++;
        });
        $rootScope.hiddenPosts = outC;
        return filtered;
    };
});
app.controller("ScrapeCtrl", function($scope, $firebase) {
    //Firebase Link
    var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
    var data = $firebase(ref.child('listings'));
    var snapdata = ref.child('listings');
    $scope.data = data.$asArray();
    var updated = $firebase(ref.child('LastScraped'));
    $scope.updated = updated.$asObject();
    //Jumbotron Vars
    $scope.comingSoon = 'Adding more cities soon';
    $scope.search_loc = 'Boston';
    //Get oldest post
    $scope.showJobs =[];
    var oldestJob = new Date().getTime();
    snapdata.once('value', function(dataSnapshot) {
        var dataSnap = dataSnapshot.val();
        for (var key in dataSnap) {
            if (dataSnap[key].created < oldestJob) {
            oldestJob = dataSnap[key].created;
            }
        }
        if (!$scope.loggedIn) {
            $scope.showJobs = [oldestJob,oldestJob+86400000];
        } else {
            $scope.showJobs = [oldestJob,oldestJob+3.1536e+10];
        }
    });
    //Set body style
    $scope.bodyStyle = {
        overflow: "hidden"
    };
    $scope.checkPut = function() {
        $scope.bodyStyle = ($scope.search.length > 0) ? {
            overflow: "auto"
        } : {
            overflow: "hidden"
        };
    };
    //Check if user is logged in
    $scope.$on('userOn', function(event, data) {
        $scope.loggedIn = data;
        if (!data) {
            $scope.showJobs = [oldestJob,oldestJob+86400000];
        } else {
            $scope.showJobs = [oldestJob,oldestJob+3.1536e+10];
        }
    });
    //date friendly view
    $scope.timeFunction = function(a) {
        var today = new Date();
        var lastRun = new Date(a);

        if ((today.getDate()) == lastRun.getDate())
            return "today";

        if ((today.getDate() - 1) == lastRun.getDate())
            return "yesterday"
    };
    $scope.openSignup = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.$broadcast('toggleSignup', true);
    };
});

app.controller("UserCtrl",
    function($scope, $firebaseAuth, $firebase, postEmailForm, $location) {
        var ref2 = new Firebase("https://glowing-inferno-8009.firebaseio.com");
        var usersRef = ref2.child("users");
        //Get validated emails
        var setEmails = [];
        usersRef.once('value', function(userSnapshot) {
            var userSnap = userSnapshot.val();
            for (var key in userSnap) {
                //noinspection JSUnfilteredForInLoop
                setEmails.push(userSnap[key].email);
            }
        });
        $scope.authObj = $firebaseAuth(ref2);
        $scope.authData = $scope.authObj.$getAuth();
        if ($scope.authData !== null) {
            var userInfo = $firebase(usersRef.child($scope.authData.uid));
            $scope.userData = userInfo.$asObject();
                $scope.$emit('userOn', true);
        }

        $scope.logoPopover = 'Welcome to Jobtill! We pull and compile the best jobs from high-growth companies.';

        //Toggle Control
        $scope.$on('toggleSignup', function(event, a) {
            if (!$scope.status.isopen) {
                $scope.status.isopen = !$scope.status.isopen;
            }
            $scope.signupbox = a;
        });

        //clear validation text on dropdown close
        $scope.toggled = function(open) {
            if (!open) {
                $scope.signmsg = "";
                $scope.loginmsg = "";
                $scope.loginForm = {
                    loginMail: "",
                    loginPass: ""
                };
                $scope.loginFormCont.$setPristine();
                $scope.signupForm = {
                    firstName: "",
                    lastName: "",
                    signupMail: "",
                    signupPass: "",
                    signupPass2: ""
                };
                $scope.signupFormCont.$setPristine();
            }
        };
        //Sign up
        $scope.signUp = function(a) {
            var emailsGood;
            for (var i = 0; i < setEmails.length; i++) {
                if (a.signupMail === setEmails[i]) {
                    emailsGood = false;
                    $scope.signmsg = "The email address is already in use.";
                    break;
                } else {
                    emailsGood = true;
                }
            }
            if (emailsGood) {
                if (a.signupPass !== a.signupPass2) {
                    $scope.signmsg = "Passwords do not match!"
                } else {
                    $scope.signmsg = "Please check your email for the verification link!";
                    $scope.pendingSignup = true;
                    postEmailForm.postEmail({
                        email: a.signupMail,
                        password: a.signupPass,
                        firstName: a.firstName,
                        lastName: a.lastName
                    });
                }
            }
        };
        //Create account with email verification
        $scope.signUpValidate = function(a) {
            $scope.authObj.$createUser({
                email: a.a,
                password: a.b
            }).then(function() {
                return $scope.authObj.$authWithPassword({
                    email: a.a,
                    password: a.b
                });
            }).then(function() {
                $scope.$emit('userOn', true);
                $scope.authData = $scope.authObj.$getAuth();
                var userInfo = $firebase(usersRef.child($scope.authData.uid));
                $scope.userData = userInfo.$asObject();
                var usertoPush = $scope.authObj.$getAuth();
                usersRef.child(usertoPush.uid).set({
                    firstName: a.c,
                    lastName: a.d,
                    email: usertoPush.password.email,
                    provider: usertoPush.provider,
                    joined: new Date().getTime(),
                    search_tokens: "0",
                    search_terms: ""
                });
            }).catch(function(error) {
                console.error("Error: ", error);
            });
        };
        //Check for email validation
        //noinspection JSCheckFunctionSignatures
        var eValidate = $location.search();
        if (eValidate.a) {
            $scope.signUpValidate(eValidate);
        }
        //Log in	
        $scope.logIn = function(a, b) {
            if (a !== undefined && b !== undefined) {
                $scope.authObj.$authWithPassword({
                    email: a,
                    password: b
                }).then(function() {
                    $scope.authData = $scope.authObj.$getAuth();
                    var userInfo = $firebase(usersRef.child($scope.authData.uid));
                    $scope.userData = userInfo.$asObject();
                    $scope.loginmsg = "Login Success!";
                    $scope.$emit('userOn', true);
                }).catch(function(error) {
                    $scope.loginmsg = error.message;
                });
            } else {
                $scope.loginmsg = "Please enter username and password.";
            }
        };
        //Log out
        $scope.logout = function() {
            $scope.authObj.$unauth();
            $scope.authData = $scope.authObj.$getAuth();
            $scope.$emit('userOn', false);
        };
        //Close Controller
    });