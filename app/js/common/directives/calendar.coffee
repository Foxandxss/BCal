angular.module('directives.calendar', [])
	.controller('calendarCtrl', ($scope, $attrs) ->
		$scope.days = []

		year = $attrs.year || moment().year() # Current year
		month = $attrs.month - 1 || moment().month() # Current month. We subtract one because it is 0 based.

		date = moment([year, month, 1])

		# We need to find out how many days we need to fill from the last month
		switch date.day()
			when 1 then numLastDays = 7 # AKA Monday, so we need 7 days from the last month
			when 0 then numLastDays = 6 # AKA Sunday, so we need 6 days from the last month 
			else numLastDays = date.day() - 1 # If not Monday nor Sunday

		numCurrentMonthDays = date.daysInMonth() # how many days we have in this month
		lastMonthLastDay = date.subtract('months', 1).daysInMonth() # first day to show in the calendar
		lastMonthFirstDay = lastMonthLastDay - numLastDays + 1 # last day of the last month
		nextMonthLastDay = 42 - numCurrentMonthDays - numLastDays # days we need from the next month

		# Add last month days
		for i in [lastMonthFirstDay..lastMonthLastDay]
			$scope.days.push
				highlight: false
				month: 'prev'
				day: i

		# Add current month days
		for i in [1..numCurrentMonthDays]
			$scope.days.push
				highlight: false
				month: 'current'
				day: i

		# Add next month days
		for i in [1..nextMonthLastDay]
			$scope.days.push
				highlight: false
				month: 'next'
				day: i

	)
	.directive 'calendar', ->
		return {
			restrict: 'E'
			controller: 'calendarCtrl'
		}