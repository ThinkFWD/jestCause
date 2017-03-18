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
					console.log(resp.data.token)
					return resp.data.token;
				});
		};

		var isAuth = function () {
			return !!$window.localStorage.getItem('com.hang');
		}

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
	});