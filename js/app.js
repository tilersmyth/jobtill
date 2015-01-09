var app = angular.module("Scrape", ["firebase"]);

//Firebase Link
app.controller("ScrapeCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
  var data = $firebase(ref.child('listings'));
  $scope.data = data.$asObject();
  var updated = $firebase(ref.child('LastScraped'));
  $scope.updated = updated.$asObject();
});

