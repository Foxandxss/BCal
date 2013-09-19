angular.module('services.calendar', [])
	.service('calendar', function() {
		this.getCalendar = function(year, month) {
			var days = [], numLastDays, numCurrentMonthDays, lastMonthLastDay,
									lastMonthFirstDay, nextMonthLastDay;

			date = moment([year, month - 1, 1]);
			// We need to find out how many days we need to fill from the last month
			switch(date.day()) {
				case 0: // AKA Sunday, so we need 6 days from the last month
					numLastDays = 6;
					break;
				case 1: // AKA Monday, so we need 7 days from the last month
					numLastDays = 7;
					break;
				default: // If not Monday nor Sunday
					numLastDays = date.day() - 1;
			}

			numCurrentMonthDays = date.daysInMonth(); // How many days we have in this month
			lastMonthLastDay = date.subtract('months', 1).daysInMonth(); // Last day to show in the calendar
			lastMonthFirstDay = lastMonthLastDay - numLastDays + 1; // First day of the last month
			nextMonthLastDay = 42 - numCurrentMonthDays - numLastDays; // days we need from the next month

			// Add last month days
			angular.forEach(_.range(lastMonthFirstDay, lastMonthLastDay + 1), function(day) {
				days.push({
					highlight: false,
					month: 'prev',
					day: day
				});
			});

			// Add current month days
			angular.forEach(_.range(1, numCurrentMonthDays + 1), function(day) {
				days.push({
					highlight: false,
					month: 'current',
					day: day
				});
			});

			// Add next month days
			angular.forEach(_.range(1, nextMonthLastDay + 1), function(day) {
				days.push({
					highlight: false,
					month: 'next',
					day: day
				});
			});

			return days;
		};
	});