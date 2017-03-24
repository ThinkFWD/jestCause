angular.module('hang.auth', [])

	.controller('AuthController', function ($scope, $window, $location, $http, Auth, Users) {
		$scope.user = {};
		$scope.data;
		console.log("THIS IS THE USER OBJ: ",$scope.user);
		$scope.signin = function (user) {
			Auth.signin(user)
				.then(function (token) {
					$window.localStorage.setItem('com.hang', token);
					Users.saveUser(token);
					$location.path('/home');
				})
				.catch(function (error) {
					alert("WRONG PASSWORD")
					console.error(error);
				});
		};

		$scope.signup = function () {
			Auth.signup($scope.user)
				.then(function (token) {
					$window.localStorage.setItem('com.hang', token);
					Users.saveUser(token);
					$location.path('/home');
				})
				.catch(function (error) {
					console.error(error);
				});
		};

		$scope.signuplink = function () {
			$location.path('/signup')
		};

	});
