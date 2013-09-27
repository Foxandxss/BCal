angular.module('app', ['ui.router', 'calendar', 'options'])
	.config(function($locationProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/calendar');
	}).
	run(function($rootScope, $state, bdayscalendar) {

		$rootScope.$on('$stateChangeStart', function(event, next, current) {
			var options = bdayscalendar.getOptions();
			if (!options && next.url !== '/options') {
				event.preventDefault();
				$state.go('options');
			}
		});
	});