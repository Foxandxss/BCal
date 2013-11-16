angular.module('directives.calendar', ['services.moment', 'services.utils'])
	.directive('calendar', function(moment, utils) {
		return {
			restrict: 'E',
			scope: {
				days: '='
			},
			templateUrl: 'common/directives/calendar/calendar.tpl.html',
			link: function(scope, element, attrs) {
				var today = moment();
				var requested = scope.days.date;
				if (angular.isDefined(attrs.showToday)) {
					if (utils.isTodayInRange(today, requested)) {
						var result = utils.compareDateMonth(today.month(), requested.month());
						var match;
						switch (result) {
							case -1: // Today can appear in the last day of the last month
								match = _.find(scope.days.bdays, {day: today.date(), month: 'prev'});
								if (match) { // There is a match (and it should :P)
									utils.addCurrentDay(match);
								}
								break;
							case 0: // Today appears for sure in the actual month
								match = _.find(scope.days.bdays, {day: today.date(), month: 'current'});
								if (match) { // There is a match (and it should :P)
									utils.addCurrentDay(match);
								}								
								break;
							case 1: // Today can appear in the previous month first days of next month
								match = _.find(scope.days.bdays, {day: today.date(), month: 'next'});
								if (match) { // There is a match (and it should :P)
									utils.addCurrentDay(match);
								}
								break;
						}
					}
				}
			}
		};
	});