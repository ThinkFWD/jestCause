angular.module('hang.home', [])
	.controller('HomeController', function ($scope, $sce, Users, $mdPanel, $location, $mdDialog, $route, Auth, Insert, Events) {
		$scope.goHome = function() {
			$location.path('/home');
		}

		$scope.getAll = function(){
			Events.getAllEvents()
			.then(function(events) {
				//Line 12 - 17 adds the host object to the event object
				$scope.allEvents = [];
				events.forEach(function(event) {
					$scope.users.forEach(function(user) {
						if(user.id === event.host_id) {
							event.host = user;
							$scope.allEvents.push(event)
						}
					})
				})
				console.log("EVENTS :", $scope.allEvents)
			})
		};

		$scope.openEvent = function(event){
			Insert.insertEvent(event)
			$location.path("/eventpage");
		}


		$scope.currentNavItem = "hang";
		// $scope.getCurrentUser = Users.getCurrentUser;
		$scope.event = {};
		$scope.eventGuests = [];

		Events.getGuestList(guests => $scope.guests = guests.toString());

		Users.getCurrentUser()
			.then(user => {
				$scope.user = user[0];
				Events.getEvents($scope.user)
				.then(events => {
					$scope.events = events;
					Events.getHostedEvents($scope.user)
					.then(hostedEvents => {
						$scope.hostedEvents = hostedEvents
					})
					.then(function() {
						Events.getGuestList(guests => {
							$scope.eventGuests = guests;
							console.log("GUEST LIST", guests)
							Users.getUsers()
							.then(users => {
								users = users.filter(user => user.email !== $scope.user.email);
								$scope.users = users;
							})
							//once all users are received, then get all events in order to add user object to host object
							.then($scope.getAll)
						});
					});
				})
			});

		$scope.createEventClick = function($event) {
			Events.saveGuestList($scope.eventGuests);
			$scope.toEvent($event)
		}

		$scope.createEvent = function() {
			Events.createEvent({
				email: $scope.user.email,
				venue: $scope.event.venue,
				address: $scope.event.address,
				when: $scope.event.when,
				description: $scope.event.description,
				guests: $scope.guests
			})
			.then(resp => {
				Events.saveGuestList([]);
				$location.path('/events');
				Events.getGuestList(guestList => {
					$scope.eventGuests = guestList;
				});
			});
		}

		$scope.toggleHang = function () {
			$scope.user.hang = !$scope.user.hang;
			Users.updateUser($scope.user)
				.then(resp => console.log('updated ', resp))
		}

		$scope.toHome = function() {
			$location.path('/home');
		}

		$scope.toEvent = function (ev) {
			$mdDialog.show({
					controller: 'HomeController',
					templateUrl: 'app/event/createEvent.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: $scope.customFullscreen
				});
		}

		$scope.eventList = function () {
			$location.path('/events');
		}

		$scope.changeUrl = function (ev) {
			var confirm = $mdDialog.prompt()
				.title('enter new profile picture url')
				.placeholder('url link')
				.ariaLabel('url link')
				.targetEvent(ev)
				.ok('Confirm')
				.cancel('Cancel');

			$mdDialog.show(confirm).then((result) => {
				Users.updateUser({
						email: $scope.user.email,
						profile_url: result
					})
					.then($route.reload())
			});
		}

		$scope.userEventAdd = function () {
			// this.item.invited = this.item.invited === undefined ? true : !this.item.invited;
			if (!$scope.userIsGuest(this.item.email)) {
				$scope.eventGuests.push(this.item.email);
				this.item.invited = true;
			} else {
				$scope.eventGuests.splice($scope.eventGuests.indexOf(this.item.email), 1)
				this.item.invited = false;
			}
		};

		$scope.userIsGuest = function(guest) {
			return $scope.eventGuests.indexOf(guest) > -1;
		}

		$scope.signout = function () {
			Auth.signout();
		}

		$scope.closeDialog = function(ev) {
			$mdDialog.hide();
			$scope.eventGuests = [];
		}


	})
