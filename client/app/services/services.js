angular.module('hang.services', [])

	.factory('Auth', function ($http, $location, $window) {
		var signin = function (user) {
			return $http({
					method: 'POST',
					url: '/api/users/signin',
					data: user
				})
				.then(function (resp) {
					return resp.data.token;
				});
		};

		var signup = function (user) {
			return $http({
					method: 'POST',
					url: '/api/users/signup',
					data: user
				})
				.then(function (resp) {
					return resp.data.token;
				});
		};

		var isAuth = function () {
			return !!$window.localStorage.getItem('com.hang');
		};

		var signout = function () {
			$window.localStorage.removeItem('com.hang');
			$location.path('/signin');
		};


		return {
			signin: signin,
			signup: signup,
			isAuth: isAuth,
			signout: signout
		};
	})

	.factory('Users', function($http, $location, $window) {
		var currentUser;

		var getUsers = function() {
			return $http({
				method: 'GET',
				url: '/api/users/'
			})
			.then(function(resp) {
				return resp.data;
			});
		};

		var updateUser = function(user) {
			return $http({
				method: 'PUT',
				url: '/api/users/',
				data: user
			})
			.then(function(resp) {
				return resp.data
			});
		};

		var saveUser = function(user) {
			currentUser = user;
		};

		var getCurrentUser = function() {
			return $http({
				method: 'GET',
				url: '/api/currentUser',
			})
			.then(user => {
				return user.data;
			});
		}

		return {
			getUsers,
			updateUser,
			saveUser,
			getCurrentUser
		}
	})

	.factory('Events', function($http, $location, $window) {
		var guestList = [];

		var getAttendees = function(eventID) {
			return $http({
				method: 'GET',
				url: '/api/attendees',
				headers: {
					id: eventID
				}
			})
			.then(function(resp) {
				return resp.data;
			})
		};

		var getAllEvents = function(){
			return $http({
				method: 'GET',
				url: '/api/allevents'
			})
			.then(resp =>{
				return resp.data;
			})
			.catch(err => {
				console.log("There was a error")
			})
		};

		var getEvents = function(user) {
			return $http({
				method: 'GET',
				url: '/api/events',
				headers: {
					email: user.email
				}
			})
			.then(resp => {
				return resp.data;
			});
		};

		var getHostedEvents = function(user) {
			return $http({
				method: 'GET',
				url: '/api/hostedEvents',
				headers: {
					email: user.email
				}
			})
			.then(resp => resp.data)
		};

		var createEvent = function(event) {
			return $http({
				method: 'POST',
				url: '/api/events',
				data: {
					email: event.email,
					venue: event.venue,
					address: event.address,
					when: event.when,
					description: event.description,
					guests: event.guests
				}
			})
			.then(resp => {
				return resp;
			});
		}

		var saveGuestList = function(guests) {
			guestList = guests;
		};

		var getGuestList = function(callback) {
			callback(guestList);
		}
		return {
			getEvents,
			createEvent,
			getHostedEvents,
			saveGuestList,
			getGuestList,
			getAllEvents,
			getAttendees
		}
	})
	.factory('Insert', function($http, $location){
		const current = {};
		current.insertEvent = function(event){
			current.currentEvent = event;
		}
		return current;
	})
	.factory('UserInsert', function($http, $location){
		const current = {};
		current.insert = function(user){
			current.user = user
		}
		return current;
	})
