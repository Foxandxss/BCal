describe('controller: options', function() {
	var ctrl, options, scope, $controller;

	beforeEach(module('ui.router'));
	beforeEach(module('options'));

	beforeEach(inject(function(_$controller_, _$rootScope_) {
		$controller = _$controller_;
		scope = _$rootScope_.$new();
		options = {};
	}));

	describe("new options", function() {
		beforeEach(function() {
			ctrl = $controller('OptionsCtrl', {$scope: scope, utils: {}, options: {}});
		});

		it("contains some defaults", function() {
			expect(scope.options.startDay.getFullYear()).toBe(new Date().getFullYear())
			expect(scope.options.startDay.getMonth()).toBe(new Date().getMonth())
			expect(scope.options.startDay.getDate()).toBe(new Date().getDate())
			expect(scope.options.last).toBe(1);
			expect(scope.options.cycle).toBe(20);
		});

		it("shouldn't cointain the cancel button", function() {
			expect(scope.canCancel).toBe(false)
		});
	});

	describe("with options", function() {
		var fakeUtils;
		var fakeState;
		beforeEach(function() {
			fakeUtils = {
				fromMomentToDate: function() {}
			};

			fakeState = {
				go: function() {}
			};

			spyOn(fakeUtils, 'fromMomentToDate').andReturn(new Date());
			spyOn(fakeState, 'go');
			ctrl = $controller('OptionsCtrl', {$scope: scope, $state: fakeState, utils: fakeUtils, options: {startDay: moment(), last: 6, cycle: 28}});			
		});

		it("contains the provided options", function() {
			expect(scope.options.startDay.getFullYear()).toBe(new Date().getFullYear())
			expect(scope.options.startDay.getMonth()).toBe(new Date().getMonth())
			expect(scope.options.startDay.getDate()).toBe(new Date().getDate())
			expect(scope.options.last).toBe(6);
			expect(scope.options.cycle).toBe(28);
		});

		it("should cointain the cancel button", function() {
			expect(scope.canCancel).toBe(true)
		});

		it("cancel should redirect to the calendar", function() {
			scope.cancel();
			expect(fakeState.go).toHaveBeenCalledWith('home');
		});
	});

	describe("submitting new options", function() {
		var fakeBdays;
		var fakeState;
		beforeEach(function() {
			fakeBdays = {
				setOptions: function(startDay, last, cycle) {}
			};

			fakeState = {
				go: function() {}
			};

			spyOn(fakeBdays, 'setOptions');
			spyOn(fakeState, 'go');
			ctrl = $controller('OptionsCtrl', {$scope: scope, $state: fakeState, utils: {}, options: {}, bdayscalendar: fakeBdays});
		});

		it("should call bdayscalendar with the right options and redirect", function() {
			scope.optionsForm = {
				$valid: true // We mock the form validity.
			}

			scope.submitOptions();
			expect(fakeBdays.setOptions).toHaveBeenCalledWith({year: scope.options.startDay.getFullYear(), month: scope.options.startDay.getMonth() + 1, day: scope.options.startDay.getDate()}, scope.options.last, scope.options.cycle);
			expect(fakeState.go).toHaveBeenCalledWith('home');
		});
	});
});