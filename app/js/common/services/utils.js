angular.module('services.utils', ['services.moment'])
	.service('utils', function(moment) {
		this.fromMomentToDate = function(momDate) {
			return new Date(momDate.year(), momDate.month(), momDate.date());
		};

		this.fromDateToMoment = function(date) {
			return moment([date.getFullYear(), date.getMonth(), date.getDate()]);
		};

		this.isTodayInRange = function(today, requested) {
			var todayYear = today.year();
			var requestedYear = requested.year();
			var todayMonth = today.month() + 1;
			var requestedMonth = requested.month() + 1;

			var yearDifference = todayYear - requestedYear;

			if (yearDifference < -1 && yearDifference > 1) { // AKA, two years of difference
				return false;
			}

			if (todayYear !== requestedYear) { // Check if we are on the last or first month
				if (todayMonth === 12 && requestedMonth === 1) {
					return true;
				}
				if (todayMonth === 1 && requestedMonth === 12) {
					return true;
				}
				return false;
			}

			var monthDifference = this.compareDateMonth(todayMonth, requestedMonth);

			if (monthDifference >= -1 && monthDifference <= 1) { // AKA we are in a good range 
				return true;
			}

			return false;
		};

		this.compareDateMonth = function(todayMonth, requestedMonth) {
			return todayMonth - requestedMonth;
		};

		this.addCurrentDay = function(day) {
			if (day.highlight) {
				day.currentDayText = true;
			} else {
				day.currentDayDiv = true;
			}
		};
	});