angular.module('services.utils', ['services.moment'])
	.service('utils', function(moment) {
		this.fromMomentToDate = function(momDate) {
			return new Date(momDate.year(), momDate.month(), momDate.date());
		};

		this.fromDateToMoment = function(date) {
			return moment([date.getFullYear(), date.getMonth(), date.getDate()]);
		};
	});