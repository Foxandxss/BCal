angular.module('directives.calendar', [])
	.directive('calendar', function() {
		return {
			restrict: 'E',
			scope: {
				days: '='
			},
			templateUrl: 'common/directives/calendar/calendar.tpl.html'
		};
	});