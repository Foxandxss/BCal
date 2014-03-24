describe("service: calendar", function() {
	var calendar;

	beforeEach(module("services.calendar"));

	beforeEach(inject(function(_calendar_) {
		calendar = _calendar_;
	}));

	describe("#getCalendar(year, month)", function() {
		it("should generate a calendar for the provided date", function() {
			var year = 2013, month = 9;
			var generatedCalendar = calendar.getCalendar(year, month);
			expect(generatedCalendar.length).toBe(42);
			expect(_.first(generatedCalendar).day).toBe(26);
			expect(_.last(generatedCalendar).day).toBe(6);			
		});

		it("should generate the correct calendar for a leap year", function() {
			var year = 2012, month = 2; // Leap year
			var generatedCalendar = calendar.getCalendar(year, month);
			expect(generatedCalendar.length).toBe(42);
			expect(_.first(generatedCalendar).day).toBe(30);
			expect(_.last(generatedCalendar).day).toBe(11);
		});

    it('should generate a calendar where the first day is sunday', function() {
      var year = 2014, month = 3;
      var generatedCalendar = calendar.getCalendar(year, month, true);
      expect(generatedCalendar.length).toBe(42);
      expect(_.first(generatedCalendar).day).toBe(23);
      expect(_.last(generatedCalendar).day).toBe(5);
    });
	});

});