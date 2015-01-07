var app = angular.module("Scrape", ["firebase"]);

//Firebase Link
app.controller("ScrapeCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://glowing-inferno-8009.firebaseio.com/listings");
  var sync = $firebase(ref);
  $scope.sync = sync.$asObject();
});

