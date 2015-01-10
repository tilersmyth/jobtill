var app = angular.module("Scrape", ["firebase", "ui.bootstrap"]);

//Firebase Link
app.controller("ScrapeCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com");
  var data = $firebase(ref.child('listings'));
  $scope.data = data.$asArray();
  var updated = $firebase(ref.child('LastScraped'));
  $scope.updated = updated.$asObject();
  $scope.comingSoon = 'Adding more cities soon';
});
