angular.module('hang.eventpage', [])
  .controller('eventPageCtrl', function($scope, $sce, $location, Insert, Users, Events, UserInsert){
    //EVENT AND HOST ASSIGNMENT================================================
    $scope.currentEvent = Insert.currentEvent;
    $scope.host_id = $scope.currentEvent.host_id;

    //ATTENDING LIST===========================================================
    $scope.getAttendees = function(eventID) {
      Events.getAttendees(eventID)
      .then(function(users) {
        $scope.attendees = users;
        console.log($scope.attendees);
        //line 11-16 adds the host to the attendees
        Users.getUsers()
        .then(function(users) {
          users.forEach(function(user) {
            if(user.id === $scope.host_id){
              console.log("USER MATCHES HOST");
              $scope.attendees.push(user);
            }
          })
         })
      })
    }

    $scope.getAttendees($scope.currentEvent.id);

    //ATTENDEE CLICK===========================================================
    $scope.openUser = function(user) {
      UserInsert.insert(user)
      $location.path('/profile')
    }

    //GOOGLE MAPS INTEGRATION==================================================
		$scope.escapedAddress = $scope.currentEvent.address.split(" ").join("%20");
		$scope.untrustedMapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDanwxT0CdlMhsj0D2Yn-t6gNZ6K3_Pjfs&q="+$scope.escapedAddress;
		$scope.mapUrl = $sce.trustAsResourceUrl($scope.untrustedMapUrl)
});
