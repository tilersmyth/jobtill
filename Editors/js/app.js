var app = angular.module("editor", ["firebase"]);

app.controller("EditCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
  var jobref = $firebase(ref.child('listings'));
  $scope.items = jobref.$asArray();
  var siteref = $firebase(ref.child('scrape-vars'));
  $scope.getsites = siteref.$asArray();  
});
