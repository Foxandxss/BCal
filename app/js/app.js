angular.module('app', ['ui.router', 'calendar'])
	.config(function($locationProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/calendar');
	});