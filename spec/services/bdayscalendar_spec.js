describe("service: bdays calendar", function() {
	var calendar;

	beforeEach(module("services.bdayscalendar"));

	beforeEach(inject(function(_bdayscalendar_) {
		calendar = _bdayscalendar_;
	}));

	describe("#setOptions(startDay, last, cycle)", function() {
		it("contains the right options", function() {
			var date = moment([2013, 8, 29]);
			calendar.setOptions(date, 6, 28);
			var options = calendar.getOptions();
			var expectedResult = {
				startDay: date,
				last: 6,
				cycle: 28
			};
			expect(options).toEqual(expectedResult);
		});

		it("throws if you put a 'last' out of range", function() {
			expect(function() { calendar.setOptions(moment(), 0,  28) }).toThrow(new Error("The 'last' or 'cycle' is out of range"));
			expect(function() { calendar.setOptions(moment(), 10, 28) }).toThrow(new Error("The 'last' or 'cycle' is out of range"));
		});
		it("throws if you put a 'cycle' out of range", function() {
			expect(function() { calendar.setOptions(moment(), 2, 32) }).toThrow(new Error("The 'last' or 'cycle' is out of range"));
			expect(function() { calendar.setOptions(moment(), 2, 19) }).toThrow(new Error("The 'last' or 'cycle' is out of range"));
		});
	});

	describe("#getCalendar(year, month)", function() {
		it("generates the calendar with the bdays highlighted", function() {
			var date = moment([2013, 8, 26]);
			calendar.setOptions(date, 6, 28);
			var generatedCalendar = calendar.getCalendar(2013, 9);
			var expectedResult = [{highlight: true, month: "prev", day: 29 },{highlight: true, month: "prev",	day: 30},{highlight: true, month: "prev", day: 31},{highlight: true,month: "current",	day: 1},{ highlight: true, month: "current", day: 2},{ highlight: true,	month: "current",	day: 3},{	highlight: true, month: "current", day: 26},{	highlight: true, month: "current", day: 27},{highlight: true,	month: "current",	day: 28},{highlight: true,month: "current",	day: 29},{highlight: true,month: "current",	day: 30},{highlight: true,month: "next",day: 1}];

			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("works good for a leap year", function() {
			var date = moment([2012, 1, 28]);
			calendar.setOptions(date, 6, 28);
			var generatedCalendar = calendar.getCalendar(2012, 2);
			var expectedResult = [{highlight: true, month: "prev", day: 31 },{highlight: true, month: "current",	day: 1},{highlight: true, month: "current", day: 2},{highlight: true,month: "current",	day: 3},{ highlight: true, month: "current", day: 4},{ highlight: true,	month: "current",	day: 5},{	highlight: true, month: "current", day: 28},{	highlight: true, month: "current", day: 29},{highlight: true,	month: "next",	day: 1},{highlight: true,month: "next",	day: 2},{highlight: true,month: "next",	day: 3},{highlight: true,month: "next",day: 4}];
			
			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("works 3 months next to the last menstruation date", function() {
			var date = moment([2013, 8, 26]);
			calendar.setOptions(date, 6, 28);
			var generatedCalendar = calendar.getCalendar(2013, 12);
			var expectedResult = [{highlight: true, month: "current", day: 19 },{highlight: true, month: "current",	day: 20},{highlight: true, month: "current", day: 21},{highlight: true,month: "current",	day: 22},{ highlight: true, month: "current", day: 23},{ highlight: true,	month: "current",	day: 24}];
			
			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("works 3 months before to the last mensturation date", function() {
			var date = moment([2013, 8, 26]);
			calendar.setOptions(date, 6, 28);
			var generatedCalendar = calendar.getCalendar(2013, 6);
			var expectedResult = [{highlight: true, month: "current", day: 6 },{highlight: true, month: "current",	day: 7},{highlight: true, month: "current", day: 8},{highlight: true,month: "current",	day: 9},{ highlight: true, month: "current", day: 10},{ highlight: true,	month: "current",	day: 11},{	highlight: true, month: "next", day: 4},{	highlight: true, month: "next", day: 5},{highlight: true,	month: "next",	day: 6},{highlight: true,month: "next",	day: 7}];

			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("works with the shortest cycle and last", function() {
			var date = moment([2013, 8, 1]);
			calendar.setOptions(date, 1, 20);
			var generatedCalendar = calendar.getCalendar(2013, 9);
			var expectedResult = [{highlight: true, month: "current", day: 1 },{highlight: true, month: "current",	day: 21}];

			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("works with the largest cycle and shortest last", function() {
			var date = moment([2013, 8, 1]);
			calendar.setOptions(date, 1, 31);
			var generatedCalendar = calendar.getCalendar(2013, 9);
			var expectedResult = [{highlight: true, month: "current", day: 1 }, {highlight: true, month: 'next', day: 2}];

			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("works with the largest cycle and last", function() {
			var date = moment([2013, 8, 1]);
			calendar.setOptions(date, 9, 31);
			var generatedCalendar = calendar.getCalendar(2013, 9);
			var expectedResult = [{highlight: true, month: "current", day: 1 },{highlight: true, month: "current",	day: 2},{highlight: true, month: "current", day: 3},{highlight: true,month: "current",	day: 4},{ highlight: true, month: "current", day: 5},{ highlight: true,	month: "current",	day: 6},{	highlight: true, month: "current", day: 7},{	highlight: true, month: "current", day: 8},{highlight: true,	month: "current",	day: 9}, {highlight: true, month: 'next', day: 2}, {highlight: true, month: 'next', day: 3}, {highlight: true, month: 'next', day: 4}, {highlight: true, month: 'next', day: 5}, {highlight: true, month: 'next', day: 6}];

			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("works with the shortest cycle and largest last", function() {
			var date = moment([2013, 8, 15]);
			calendar.setOptions(date, 9, 20);
			var generatedCalendar = calendar.getCalendar(2013, 9);
			var expectedResult = [{highlight: true, month: "prev", day: 26 },{highlight: true, month: "prev",	day: 27},{highlight: true, month: "prev", day: 28},{highlight: true,month: "prev",	day: 29},{ highlight: true, month: "prev", day: 30},{ highlight: true,	month: "prev",	day: 31},{	highlight: true, month: "current", day: 1},{	highlight: true, month: "current", day: 2},{highlight: true,	month: "current",	day: 3}, {highlight: true, month: 'current', day: 15}, {highlight: true, month: 'current', day: 16}, {highlight: true, month: 'current', day: 17}, {highlight: true, month: 'current', day: 18}, {highlight: true, month: 'current', day: 19}, {highlight: true, month: 'current', day: 20}, {highlight: true, month: 'current', day: 21}, {highlight: true, month: 'current', day: 2}, {highlight: true, month: 'current', day: 23}, {highlight: true, month: 'next', day: 6}];

			expect(generatedCalendar.length).toBe(42);
			expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
		});

		it("throws if we don't set the options first", function() {
			expect(function() { calendar.getCalendar(2013, 9) }).toThrow(new Error("You need to set the options first"));
		});
	})
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