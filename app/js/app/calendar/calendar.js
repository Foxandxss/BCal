angular.module('calendar', ['services.bdayscalendar', 'directives.calendar'])
	.controller('CalendarCtrl', function($scope, bdayscalendar) {
		bdayscalendar.setOptions({year: 2013, month: 9, day: 26}, 6, 28); // temporary hard coded
		$scope.bdays = bdayscalendar.getCalendar(2013, 9); // temporary hard code
	});