describe('directive: calendar', function() {
	var element, $rootScope, $compile, bdayscalendar;

	beforeEach(module('app')); // For the template
	beforeEach(module('directives.calendar')); // For the directive
	beforeEach(module('services.bdayscalendar')); // For the bdayscalendar service

	beforeEach(inject(function(_$rootScope_, _$compile_, _bdayscalendar_, $location) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;

		scope = $rootScope.$new();

		spyOn($location, 'path').andReturn('/foo');

		bdayscalendar = _bdayscalendar_;

		bdayscalendar.setOptions({year: 2013, month: 9, day: 26}, 6, 28);
		scope.bdays = bdayscalendar.getCalendar(2013, 9);

		element = $compile('<calendar highlight-today days="bdays"></calendar>')(scope);
		scope.$digest();
	}));

	describe('directive template', function() {
		it('contains a div for each day of the week', function() {
			var divs = element.find('#calendar > div.calendar-header');
			expect(divs.length).toBe(7);
		});
		it('contains 42 divs, one for every day', function() {
			var divs = element.find('#calendar > div.a-day');
			expect(divs.length).toBe(42);
		});

		it('contains 12 highlighted days', function() {
			var highlightedDivs = element.find('#calendar > div.highlight');
			expect(highlightedDivs.length).toBe(12);
		});

		it('contains 12 days outside the current month, with proper CSS', function() {
			var outsideMonthSpans = element.find('#calendar span.outside-month-day');
			expect(outsideMonthSpans.length).toBe(12);
		});
    it('contains Monday as the first day of the week by default', function() {
      var headers = element.find('.calendar-header');
      var firstHeaderText = headers[0].innerText;
      expect(firstHeaderText).toContain('Monday');
    });
    it('contains Sunday as the first day of the week if `start-sunday` is true', function() {
      scope.startSunday = true;
      element = $compile('<calendar days="bdays" start-sunday="startSunday"></calendar>')(scope);
      scope.$digest();

      var headers = element.find('.calendar-header');
      var firstHeaderText = headers[0].innerText;
      expect(firstHeaderText).toContain('Sunday');
    });
	});
});