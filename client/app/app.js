angular.module('hang', [
	'hang.auth',
	'hang.home',
	'hang.services',
	'ngMaterial',
	'hang.profile',
	'hang.eventpage',
	'hang.tone', 
	'hang.render', 
	'hang.aster',
	'ngRoute'
])
.config(function($routeProvider, $httpProvider, $locationProvider){
	$routeProvider
		.when('/signin', {
			templateUrl: 'app/auth/signin.html',
			controller: 'AuthController'
		})
		.when('/signup', {
			templateUrl: 'app/auth/signup.html',
			controller: 'AuthController'
		})
		.when('/home', {
			templateUrl: 'app/home/home.html',
			controller: 'HomeController'
		})
		.when('/createEvent', {
			templateUrl: 'app/event/createEvent.html',
			controller: 'HomeController'
		})
		.when('/events', {
			templateUrl: 'app/event/events.html',
			controller: 'HomeController'
		})
		.when('/eventpage', {
			templateUrl: 'app/eventpage/eventpage.html',
			controller: 'eventPageCtrl'
		})
		.when('/profile', {
			templateUrl: 'app/profile/profile.html',
			controller: 'ProfileController'
		})
		.otherwise({
			redirectTo: '/signin'
		});
		$locationProvider.hashPrefix('');
		$httpProvider.interceptors.push('AttachTokens');
	})


	.factory('AttachTokens', function ($window) {
		var attach = {
			request: function (object) {
				var jwt = $window.localStorage.getItem('com.hang');
				if (jwt) {
					object.headers['x-access-token'] = jwt;
				}
				object.headers['Allow-Control-Allow-Origin'] = '*';
				return object;
			}
		};
		return attach;
	})
	.run(function ($rootScope, $location, Auth) {
		$rootScope.$on('$routeChangeStart', function (evt, next, current) {
			if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
				$location.path('/signin');
			}
		});

	})
