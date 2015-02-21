
app.controller("UserCtrl",
    function($scope, $firebaseAuth, $firebase, postEmailForm, $location, $modal, UserDataStorage) {
        var ref2 = new Firebase("https://glowing-inferno-8009.firebaseio.com");
        var usersRef = ref2.child("users");
        var userData = $firebase(usersRef);
        var userDataArray = $firebase(usersRef).$asArray();
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
        $scope.authObj.$onAuth(function(authData) {
            if (authData) {
                var TuserInfo = $firebase(usersRef.child(authData.uid));
                var userStor = TuserInfo.$asObject();
                userStor.$loaded()
                    .then(function(data) {
                        UserDataStorage.update(data);
                        UserDataStorage.isLoading(false);
                    });
            } else {
                UserDataStorage.update(false);
                UserDataStorage.isLoading(false);
            }
        });

        $scope.authData = $scope.authObj.$getAuth();
        if ($scope.authData !== null) {
            var userInfo = $firebase(usersRef.child($scope.authData.uid));
            $scope.userData = userInfo.$asObject();
            $scope.$emit('userOn', $scope.userData);

        } else $scope.$emit('userOn', false);

        //Receive post data on login
        $scope.n_cleared = "loading";
        $scope.$on('user_notifs', function(event, a) {
            $scope.notifData = a;
            $scope.userData.$loaded().then(function() {
                $scope.n_cleared = $scope.userData.notifs_cleared?$scope.userData.notifs_cleared:false;
                $scope.n_soft_cleared = $scope.userData.notifs_soft_cleared?$scope.userData.notifs_soft_cleared:false;
            });
        });
        //Clear Notification
        $scope.clear_notification = function(a) {
            var id = $scope.userData.$id;
            var cleared = $scope.userData.notifs_cleared;
            cleared = !cleared? a:cleared +","+a;
            userData.$update( id, {notifs_cleared: cleared}).then(function(){
                $scope.n_cleared = $scope.userData.notifs_cleared;
            });
        };
        //Clear Notif Count
        $scope.soft_clear_notif = function(a) {
            var soft_clear = "";
            for (var key in a) {
                soft_clear = soft_clear?soft_clear+","+a[key].jobId:a[key].jobId;
            }
            var id = $scope.userData.$id;
            userData.$update( id, {notifs_soft_cleared: soft_clear}).then(function(){
                $scope.n_soft_cleared = $scope.userData.notifs_soft_cleared;
            });
        };
        //Search from notifications
        $scope.notifSearch = function(a) {
            $scope.$emit("notif_search", a);
        };

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
        //Facebook Log in
        $scope.logInFB = function() {
            $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
                if (userDataArray.$indexFor(authData.uid) < 0) {
                    usersRef.child(authData.uid).set({
                        firstName: authData.facebook.cachedUserProfile.first_name,
                        lastName: authData.facebook.cachedUserProfile.last_name,
                        email: false,
                        provider: authData.provider,
                        joined: new Date().getTime(),
                        search_tokens: "0",
                        search_terms: ""
                    });
                }
                $scope.authData = $scope.authObj.$getAuth();
                var userInfo = $firebase(usersRef.child($scope.authData.uid));
                $scope.userData = userInfo.$asObject();
                $scope.$emit('userOn', $scope.userData);

            }).catch(function(error) {
                console.error("Authentication failed:", error);
            });
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
            a.term = a.term? a.term:"";
            a.location = a.location? a.location:"";
            var usertoPush = $scope.authObj.$getAuth();
            usersRef.child(usertoPush.uid).update({ search_terms: a.term,search_location: a.location})
        });
        //Close Controller
    });