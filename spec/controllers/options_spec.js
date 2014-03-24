describe('controller: options', function() {
	var ctrl, options, scope, $controller, bdayscalendar, $state, utils;

	beforeEach(module('ui.router'));
	beforeEach(module('options', function($provide) {

		var fakeUtils = {
			fromMomentToDate: function() {}
		};

		var fakeState = {
			go: function() {}
		};

		var fakeBdays = {
			setOptions: function(startDay, last, cycle) {}
		};

		spyOn(fakeUtils, 'fromMomentToDate').andReturn(new Date());
		spyOn(fakeState, 'go');
		spyOn(fakeBdays, 'setOptions');

		$provide.value('utils', fakeUtils);
		$provide.value('$state', fakeState);
		$provide.value('bdayscalendar', fakeBdays);

	}));

	beforeEach(inject(function(_$controller_, _$rootScope_, _bdayscalendar_, _$state_, _utils_) {
		$controller = _$controller_;
		scope = _$rootScope_.$new();
		$state = _$state_;
		utils = _utils_;
		bdayscalendar = _bdayscalendar_;
		options = {};
	}));

	describe("new options", function() {
		beforeEach(function() {
			ctrl = $controller('OptionsCtrl', {$scope: scope, utils: {}, options: {}});
		});

		it("contains some defaults", function() {
			expect(scope.options.startDay.getFullYear()).toBe(new Date().getFullYear());
			expect(scope.options.startDay.getMonth()).toBe(new Date().getMonth());
			expect(scope.options.startDay.getDate()).toBe(new Date().getDate());
			expect(scope.options.last).toBe(1);
			expect(scope.options.cycle).toBe(20);
      expect(scope.options.startSunday).toBe(false);
		});

		it("shouldn't contain the cancel button", function() {
			expect(scope.canCancel).toBe(false)
		});
	});

	describe("with options", function() {
		beforeEach(function() {
			ctrl = $controller('OptionsCtrl', {$scope: scope, $state: $state, utils: utils, options: {startDay: moment(), last: 6, cycle: 28, startSunday: false}});
		});

		it("contains the provided options", function() {
			expect(scope.options.startDay.getFullYear()).toBe(new Date().getFullYear());
			expect(scope.options.startDay.getMonth()).toBe(new Date().getMonth());
			expect(scope.options.startDay.getDate()).toBe(new Date().getDate());
			expect(scope.options.last).toBe(6);
			expect(scope.options.cycle).toBe(28);
      expect(scope.options.startSunday).toBe(false);
		});

		it("should contain the cancel button", function() {
			expect(scope.canCancel).toBe(true)
		});

		it("cancel should redirect to the calendar", function() {
			scope.cancel();
			expect($state.go).toHaveBeenCalledWith('home');
		});
	});

	describe("submitting new options", function() {
		beforeEach(function() {
			ctrl = $controller('OptionsCtrl', {$scope: scope, $state: $state, utils: utils, options: {}, bdayscalendar: bdayscalendar});
		});

		it("should call bdayscalendar with the right options and redirect", function() {
			scope.optionsForm = {
				$valid: true // We mock the form validity.
			};

			scope.submitOptions();
			expect(bdayscalendar.setOptions).toHaveBeenCalledWith({year: scope.options.startDay.getFullYear(), month: scope.options.startDay.getMonth() + 1, day: scope.options.startDay.getDate()}, scope.options.last, scope.options.cycle, scope.options.startSunday);
			expect($state.go).toHaveBeenCalledWith('home');
		});
	});
});