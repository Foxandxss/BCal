describe('controller: calendar', function() {
	var ctrl, $scope, $stateParams, $state, bdayscalendar, moment, $controller, localStorageService;

	beforeEach(module('ui.router'));
	beforeEach(module('services.moment'));
	beforeEach(module('LocalStorageModule', function($provide) {
		var mockLocalStorageService = {
			add: function() {},
			isSupported: function() {}
		};

		spyOn(mockLocalStorageService, 'add');
		spyOn(mockLocalStorageService, 'isSupported').andReturn(true);

		$provide.value('localStorageService', mockLocalStorageService);
	}));

	beforeEach(module('calendar', function($provide) {
		var fakeState = { // I mock it here at this level to prevent a giant mock (if I do it on ui.router I will need to mock much more)
			go: function() {}
		};

		spyOn(fakeState, 'go');

		$provide.value('$state', fakeState);
	}));

	beforeEach(inject(function(_$controller_, _$rootScope_, _$state_, _bdayscalendar_, _moment_, _localStorageService_) {
		$controller = _$controller_;
		$state = _$state_;
		bdayscalendar = _bdayscalendar_; // I am not able to mock bdayscalendar (bad) becase I need to have a generated calendar (PR welcome)
		moment = _moment_;
		$scope = _$rootScope_.$new();
		localStorageService = _localStorageService_;
	}));

	describe("default params", function() {
		var year, month;
		beforeEach(function() {
			year = new Date().getFullYear();
			month = new Date().getMonth() + 1;				
			bdayscalendar.setOptions({year: year, month: month, day: 26}, 6, 28); // Fake data
			ctrl = $controller('CalendarCtrl', { $scope: $scope, $state: $state, $stateParams: {}, bdayscalendar: bdayscalendar});
		});

		it("should contain the actual year/month if there is no $stateParams", function() {
			expect($scope.year).toBe(year);
			expect($scope.month).toBe(month);
		});

		it("the header should have the actual month in it", function() {
			var header = moment().format('MMMM, YYYY');

			expect($scope.header).toBe(header);
		});

		it("contains the correct bdays", function() {
			var bdays = bdayscalendar.getCalendar(year, month);
			expect(calendarContainDates($scope.bdays, bdays.bdays)).toBe(true);
		});

		it("should be able to go to the last month", function() {
			var newYear, newMonth;
			$scope.lastMonth();

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
			$scope.nextMonth();

			if (month === 12) {
				newYear = year + 1;
				newMonth = 1;
			} else {
				newYear = year;
				newMonth = month + 1;
			}

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: newYear, month: newMonth});
		});

    it("should contain the options saved", function() {
      expect($scope.options.startDay.year()).toEqual(year);
      expect($scope.options.startDay.month()).toEqual(month - 1); // 0 based
      expect($scope.options.startDay.date()).toEqual(26);

      expect($scope.options.last).toEqual(6);
      expect($scope.options.cycle).toEqual(28);
      expect($scope.options.startSunday).toBe(false);
    });
	});

	describe("with stateParams", function() {
		beforeEach(function() {
			bdayscalendar.setOptions({year: 2014, month: 2, day: 26}, 6, 28); // Fake data
			ctrl = $controller('CalendarCtrl', { $scope: $scope, $state: $state, $stateParams: {year: "2014", month: "2"}, bdayscalendar: bdayscalendar});
		});

		it("should contain the year/month specified in params", function() {
			expect($scope.year).toBe(2014);
			expect($scope.month).toBe(2);
		});

		it("the header should show that we are in February 2014", function() {
			expect($scope.header).toBe("February, 2014");
		});

		it("should be able to go to the last month", function() {
			$scope.lastMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2014, month: 1});
		});

		it("should be able to go to the next month", function() {
			$scope.nextMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2014, month: 3});
		});

		it("contains the correct bdays", function() {
			var bdays = bdayscalendar.getCalendar(2014, 2);
			expect(calendarContainDates($scope.bdays, bdays.bdays)).toBe(true);
		})

		it("it should be able to move to the last year", function() {
			ctrl = $controller('CalendarCtrl', { $scope: $scope, $state: $state, $stateParams: {year: "2014", month: "1"}, bdayscalendar: bdayscalendar});
			$scope.lastMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2013, month: 12});
		});

		it("it should be able to move to the next year", function() {
			ctrl = $controller('CalendarCtrl', { $scope: $scope, $state: $state, $stateParams: {year: "2013", month: "12"}, bdayscalendar: bdayscalendar});
			$scope.nextMonth();

			expect($state.go).toHaveBeenCalledWith('concreteDate', { year: 2014, month: 1});
		});
	});
});