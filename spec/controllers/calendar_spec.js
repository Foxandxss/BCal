describe('controller: calendar', function() {
	var ctrl, scope, $stateParams, $state, bdayscalendar, $controller;

	beforeEach(module('ui.router'));
	beforeEach(module('calendar'));

	beforeEach(inject(function(_$controller_, _$rootScope_, _$state_, _bdayscalendar_) {
		$controller = _$controller_;
		$state = _$state_;
		bdayscalendar = _bdayscalendar_;
		scope = _$rootScope_.$new();
	}));

	describe("default params", function() {
		var year, month;
		beforeEach(function() {
			ctrl = $controller('CalendarCtrl', { $scope: scope, $state: $state, $stateParams: {}, bdayscalendar: bdayscalendar});
			year = new Date().getFullYear();
			month = new Date().getMonth() + 1;
		});

		it("should contain the actual year/month if there is no $stateParams", function() {
			expect(scope.year).toBe(year);
			expect(scope.month).toBe(month);
		});

		it("the header should have the actual month in it", function() {
			var header = moment().format('MMMM, YYYY');

			expect(scope.header).toBe(header);
		});

		it("contains the correct bdays", function() {
			var bdays = bdayscalendar.getCalendar(year, month);
			expect(calendarContainDates(scope.bdays, bdays)).toBe(true);
		})

		it("should be able to go to the last month", function() {
			var newYear, newMonth;
			spyOn($state, 'go');
			scope.lastMonth();

			if (month === 1) {
				newYear = year - 1;
				newMonth = 12;
			} else {
				newYear = year;
				newMonth = month - 1;
			}

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: newYear, month: newMonth});
		});

		it("should be able to go to the next month", function() {
			var newYear, newMonth;
			spyOn($state, 'go');
			scope.nextMonth();

			if (month === "12") {
				newYear = year + 1;
				newMonth = 1;
			} else {
				newYear = year;
				newMonth = month + 1;
			}

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: newYear, month: newMonth});
		});
	});

	describe("with stateParams", function() {
		beforeEach(function() {
			ctrl = $controller('CalendarCtrl', { $scope: scope, $state: $state, $stateParams: {year: "2014", month: "2"}, bdayscalendar: bdayscalendar});
		});

		it("should contain the year/month specified in params", function() {
			expect(scope.year).toBe(2014);
			expect(scope.month).toBe(2);
		});

		it("the header should show that we are in February 2014", function() {
			expect(scope.header).toBe("February, 2014");
		});

		it("should be able to go to the last month", function() {
			spyOn($state, 'go');
			scope.lastMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2014, month: 1});
		});

		it("should be able to go to the next month", function() {
			spyOn($state, 'go');
			scope.nextMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2014, month: 3});
		});

		it("contains the correct bdays", function() {
			var bdays = bdayscalendar.getCalendar(2014, 2);
			expect(calendarContainDates(scope.bdays, bdays)).toBe(true);
		})

		it("it should be able to move to the last year", function() {
			ctrl = $controller('CalendarCtrl', { $scope: scope, $state: $state, $stateParams: {year: "2014", month: "1"}, bdayscalendar: bdayscalendar});
			spyOn($state, 'go');
			scope.lastMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2013, month: 12});
		});

		it("it should be able to move to the next year", function() {
			ctrl = $controller('CalendarCtrl', { $scope: scope, $state: $state, $stateParams: {year: "2013", month: "12"}, bdayscalendar: bdayscalendar});
			spyOn($state, 'go');
			scope.nextMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2014, month: 1});
		});
	});
});

calendarContainDates = function(original, expected) {
	var result = true; // It is true unless one of the expected keys is not there

	index = {};
	original.map(function (v) {
	    index[v.highlight + '|' + v.month + '|' + v.day] = v;
	});

	// If one of the keys doesn't exist on the original, put result to false
	expected.map(function (v) {
	    var key = v.highlight + '|' + v.month + '|' + v.day;
	    if (!index.hasOwnProperty(key)) {
	        result = false;
	    }
	});

	return result;
}