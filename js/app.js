var app = angular.module("Scrape", ["firebase", "ui.bootstrap",'angulartics', 'angulartics.google.analytics', 'ngtimeago', 'pageslide-directive','timer']);
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
            }
            if (remaining<=0) {
                item.status = "old";
            }
            filtered.push(item);
        });
        return filtered;
    };
});

app.controller("ScrapeCtrl", function($scope, $firebase, $window, $timeout,$http) {
    //Firebase Link
    var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
    var data = $firebase(ref.child('listings'));
    var snapdata = ref.child('listings');
    $scope.data = data.$asArray();
    var updated = $firebase(ref.child('LastScraped'));
    $scope.updated = updated.$asObject();

    //Jumbotron Vars
    $scope.search_loc = 'Boston';

    //timer countdown
    $scope.timerRunning = true;
    $scope.currentTime = new Date().getTime();

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
        } else {
            $scope.showJobs = 1;
        }

    });
    //Get unlock codes
    $scope.$on('unlock_keys', function(event, data) {
        $scope.jobKeys = data;
    });
    $scope.openSignup = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.$broadcast('toggleSignup', true);
    };
    //Unlock job
    var handler = StripeCheckout.configure({
        key: 'pk_test_FVqkH8oMczqQ159VfBnrexb8',
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
        price*=100;
        var msg = (price===0)?"First one is free!":"Unlock Job For";
            handler.open({
                name: "Job Description",
                description: name,
                amount: price,
                panelLabel: msg
            });
        $scope.jobToken = id;
        $scope.jobprice = price;

    };
});


//How it works modal
app.controller('HiwModal', function ($scope, $modalInstance, items, $rootScope) {
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

app.controller("UserCtrl",
    function($scope, $firebaseAuth, $firebase, postEmailForm, $location, $modal) {
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
                $scope.$emit('userOn', $scope.userData);
        } else $scope.$emit('userOn', false);


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
                $scope.$emit('userOn', $scope.userData);
            }).catch(function(error) {
                console.error("Error: ", error);
            });
        };
        //Check for email validation
        //noinspection JSCheckFunctionSignatures
        var eValidate = $location.search();
        if (eValidate.process === "signup") {
            $scope.signUpValidate(eValidate);
            $location.search("");
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

                    $scope.$emit('userOn', $scope.userData);
                }).catch(function(error) {
                    $scope.loginmsg = error.message;
                });
            } else {
                $scope.loginmsg = "Please enter username and password.";
            }
        };
        //Log out
        $scope.logout = function() {
            $scope.$broadcast('closedumbSlider');
            $scope.authObj.$unauth();
            $scope.authData = $scope.authObj.$getAuth();
            $scope.$emit('userOn', false);
        };
        //Change Password
        $scope.changepassMsg = " ";
        $scope.changePassword = function(a) {
            if (a.b !== a.c) {
              $scope.changepassMsg = "New passwords do not match."
            } else {
                $scope.authObj.$changePassword({
                    email: $scope.userData.email,
                    oldPassword: a.a,
                    newPassword: a.c
            }).then(function() {
                $scope.changepassMsg = "Password changed successfully!";
                    $scope.changePass = "";
            }).catch(function(error) {
                $scope.changepassMsg = error.message;
                    $scope.changePass = "";
            });
            }
        };
        //Modal
        $scope.open = function (modal) {
            $modal.open({
                templateUrl: modal,
                controller: modal,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return {
                            user: $scope.loggedIn,
                            job: ""
                        }
                    }
                }
            });

        };
        //Unlock job
        $scope.$on('unlock_job', function(event, a,b,c) {
          var unlocked = !c? a:c +","+a;
            usersRef.child(b).update({ unlocked: unlocked});
          //  $scope.$emit('unlock_Keys', unlocked);
        });
        //Save search data
        $scope.$on('save_search_data', function(event, a) {
            var usertoPush = $scope.authObj.$getAuth();
            usersRef.child(usertoPush.uid).update({ search_terms: a.term,search_location: a.location})
        });
        //Close Controller
    });