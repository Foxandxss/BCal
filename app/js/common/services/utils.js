angular.module('services.utils', [])
	.service('utils', function() {
		this.fromMomentToDate = function(momDate) {
			return new Date(momDate.year(), momDate.month(), momDate.date());
		};

		this.fromDateToMoment = function(date) {
			return moment([date.getFullYear(), date.getMonth(), date.getDate()]);
		};
	});