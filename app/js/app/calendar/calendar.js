angular.module('calendar', ['services.bdayscalendar', 'directives.calendar'])
	.config(function($stateProvider) {
		$stateProvider.state('home', {
			url: '/calendar',
			templateUrl: 'app/calendar/calendar.tpl.html',
			controller: 'CalendarCtrl'
		})
		.state('concreteDate', {
			url: '/calendar/{year}/{month}',
			templateUrl: 'app/calendar/calendar.tpl.html',
			controller: 'CalendarCtrl'
		});
	})
	.controller('CalendarCtrl', function($scope, $stateParams, $state, bdayscalendar) {
		$scope.year = parseInt($stateParams.year, 10) || new Date().getFullYear();
		$scope.month = parseInt($stateParams.month, 10) || new Date().getMonth() + 1; // Our service is not 0 based.

		$scope.bdays = bdayscalendar.getCalendar($scope.year, $scope.month);

		$scope.header = moment([$scope.year, $scope.month - 1, 1]).format('MMMM, YYYY'); // We use moment to get the header, it is 0 based
		
		$scope.lastMonth = function() {
			if ($scope.month === 1) { // Go to the last year
				var year = $scope.year - 1;
				$state.go('concreteDate', {year: year, month: 12});
			} else { // Same year
				var month = $scope.month - 1;
				$state.go('concreteDate', {year: $scope.year, month: month});
			}
		};

		$scope.nextMonth = function() {
			if ($scope.month === 12) { // Go to the next year
				var year = parseInt($scope.year, 10) + 1;
				$state.go('concreteDate', {year: year, month: 1});
			} else { // Same year
				var month = parseInt($scope.month, 10) + 1;
				$state.go('concreteDate', {year: $scope.year, month: month});
			}
		};

		$scope.goOptions = function() {
			$state.go('options');
		};
	});