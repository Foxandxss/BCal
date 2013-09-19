angular.module('services.bdayscalendar', ['services.calendar'])
	.service('bdayscalendar', function(calendar) {
		var options;

		this.setOptions = function(startDay, last, cycle) {
			if(!startDay.year || !startDay.month || !startDay.day) {
				throw new Error("The 'date' is missing some data");
			}

			if (!last || !cycle || (last < 1 || last > 9) || (cycle < 20 || cycle > 31))
			{
				throw new Error("The 'last' or 'cycle' is out of range or missing");
			}

			momentDate = moment([startDay.year, startDay.month - 1, startDay.day]); // 0 based

			options = {
				startDay: momentDate,
				last: last,
				cycle: cycle
			};
		};

		this.getOptions = function() {
			return options;
		};

		this.getCalendar = function(year, month) {
			var requestedDate = moment([year, month - 1, 1]);
			var genCalendar = calendar.getCalendar(year, month);
			var bdays = calculatePeriod(requestedDate);
			return decorateCalendar(genCalendar, bdays);
		};

		calculatePeriod = function(date) {
			var bdays = [];
			if(!options) {
				throw new Error("You need to set the options first");
			}
			while (true) {
				// Check if we are on the date provided in the options, if not, we need to go there
				if ((options.startDay.month() !== date.month()) || (options.startDay.year() !== date.year())) {
					if (date > options.startDay) {
						options.startDay.add('days', options.cycle);
					} else {
						options.startDay.subtract('days', options.cycle);
					}
				}

				// So we are on the month, but maybe we can get an early date
				else if ((options.startDay.month() === date.month() || options.startDay.year() === date.year()) && (options.startDay.date() > options.cycle)) {
					options.startDay.subtract('days', options.cycle);
				}
				// All set, time to calculate the bdays
				else {
					// All the setup is done
					break;
				}
			}
			// So we are on the first day of the month that starts a cycle but... Maybe the last month days are on a cycle too?
			var tempDate = moment(options.startDay).subtract('days', options.cycle);
			// We add an entire cycle for the last month, even for those days we don't actually see (those are ignored later)
			angular.forEach([_.range(0, options.last)], function() {
				bdays.push({
					highlight: true,
					month: "prev",
					day: tempDate.date()
				});
				tempDate.add('days', 1);
			});

			// We check if she had a cycle that span two different months 
			if (options.startDay.date() > (options.cycle - options.last +1)) { // AKA she has menstruation in day 1 but is not the first day of the cycle
				var bdaysThisMonth = options.startDay.date() - (options.cycle - options.last + 1); // Days from this month
				var bdaysLastMonth = options.last - bdaysThisMonth; // Days from the last month
				var lastMonthDays = moment([date.year(), date.month() - 1, 1]).daysInMonth(); // We need to know what's the last day of the month

				// Time to add the last month days
				angular.forEach(_.range(0, bdaysLastMonth), function() {
					bdays.push({
						highlight: true,
						month: "prev",
						day: lastMonthDays
					});
					lastMonthDays--;
				});

				// Now this month days
				angular.forEach(_.range(0, bdaysThisMonth), function(day) {
					bdays.push({
						highlight: true,
						month: "current",
						day: day+1 // We don't want this 0 based
					});
				});
			}

			// Now is time for the current month and the next month
			var isNext = false; // We need to know if we moved to the next month
			angular.forEach(_.range(0, options.last), function() {
				if (isNext) {
					bdays.push({
						highlight: true,
						month: 'next',
						day: options.startDay.date()
					});
				} else {
					bdays.push({
						highlight: true,
						month: 'current',
						day: options.startDay.date()
					});
				}
				options.startDay.add('days', 1);
				if (options.startDay.date() === 1) { // AKA we are on the next month
					isNext = true;
				}
			});

			isNext = false;

			// Is there more bloody days this month?
			options.startDay.add('days', options.cycle - options.last);
			if (options.startDay.month() === date.month()) { // Seems so
				angular.forEach(_.range(0, options.last), function() {
					if (isNext) {
						bdays.push({
							highlight: true,
							month: 'next',
							day: options.startDay.date()
						});
					} else {
						bdays.push({
							highlight: true,
							month: 'current',
							day: options.startDay.date()
						});
					}
					options.startDay.add('days', 1);
					if (options.startDay.date() === 1) { // AKA we are on the next month
						isNext = true;
					}
				});
			} else { // Well, that month has no more bloody days, but... what about the next month?
				angular.forEach(_.range(0, options.last), function() {
					bdays.push({
						highlight: true,
						month: 'next',
						day: options.startDay.date()
					});
					options.startDay.add('days', 1);
				});
			}
			return bdays;
		};

		decorateCalendar = function(genCalendar, bdays) {
			// Index original objects by unique key
			index = {};
			genCalendar.map(function (v) {
				index['' + v.month + '|' + v.day] = v;
			});

			// Highlight if key exists in index
			bdays.map(function (v) {
				var key = '' + v.month + '|' + v.day;
				if (index.hasOwnProperty(key)) {
					index[key].highlight = true;
				}
			});

			return genCalendar;
		};
	});