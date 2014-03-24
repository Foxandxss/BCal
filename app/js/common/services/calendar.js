angular.module('services.calendar', ['services.moment'])
	.service('calendar', function(moment) {
		this.getCalendar = function(year, month, startsOnSunday) {
			var days = [], numLastDays, numCurrentMonthDays, lastMonthLastDay,
									lastMonthFirstDay, nextMonthLastDay;

			var date = moment([year, month - 1, 1]);
      var startingDay = startsOnSunday ? 0 : 1;
      var difference = startingDay - date.day();

      numLastDays = (difference > 0) ? 7 - difference : - difference;

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