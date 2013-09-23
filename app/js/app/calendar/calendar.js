angular.module('calendar', ['services.bdayscalendar', 'directives.calendar'])
	.config(function($stateProvider) {
		$stateProvider.state('home', {
			url: '/calendar',
			templateUrl: 'app/calendar/calendar.tpl.html',
			controller: 'CalendarCtrl'
		})
		.state('concreteDate', {
			url: '/calendar/:foo/:bar',
			templateUrl: 'app/calendar/calendar.tpl.html',
			controller: 'CalendarCtrl'
		});
	})
	.controller('CalendarCtrl', function($scope, $stateParams, bdayscalendar) {
		bdayscalendar.setOptions({year: 2013, month: 9, day: 26}, 6, 28); // temporary hard coded
		$scope.bdays = bdayscalendar.getCalendar(2013, 9); // temporary hard code

		$scope.header = bdayscalendar.getOptions().startDay.format('MMMM, YYYY');
		console.log($stateParams);
	});