describe("service: utils", function() {
	var utils, moment;

	beforeEach(module("services.utils"));
	beforeEach(module("services.moment"));

	beforeEach(inject(function(_utils_, _moment_) {
		utils = _utils_;
		moment = _moment_;
	}));

	describe("functionality", function() {
		it("should be able to convert from moment() to Date()", function() {
			var momDate = moment([2013, 9, 10]);
			var date = utils.fromMomentToDate(momDate);

			expect(date.getFullYear()).toBe(2013);
			expect(date.getMonth()).toBe(9);
			expect(date.getDate()).toBe(10);
		});

		it("should be able to convert from Date() to moment()", function() {
			var date = new Date(2013, 9, 10);
			var momDate = utils.fromDateToMoment(date);

			expect(momDate.year()).toBe(2013);
			expect(momDate.month()).toBe(9);
			expect(momDate.date()).toBe(10);
		});

		it("compares two dates that doesn't match because of years difference", function() {
			var date1 = moment([2013, 1, 1]);
			var date2 = moment([2011, 1, 1]);

			expect(utils.isTodayInRange(date1, date2)).toBe(false);
		});

		it("compares two dates that doesn't match in years but in months", function() {
			var date1 = moment([2013, 0, 1]);
			var date2 = moment([2012, 11, 1]);

			expect(utils.isTodayInRange(date1, date2)).toBe(true);
		});

		it("compares two dates that doesn't match in years but in months", function() {
			var date1 = moment([2012, 0, 1]);
			var date2 = moment([2013, 11, 1]);			

			expect(utils.isTodayInRange(date1, date2)).toBe(true);
		});

		it("compares two dates that match in years and have good month difference", function() {
			var date1 = moment([2013, 5, 1]);
			var date2 = moment([2013, 4, 1]);

			expect(utils.isTodayInRange(date1, date2)).toBe(true);
		});

		it("compares two dates that match in years and have good month difference", function() {
			var date1 = moment([2013, 5, 1]);
			var date2 = moment([2013, 4, 1]);

			expect(utils.isTodayInRange(date2, date1)).toBe(true);
		});

		it("compares two dates that match in years and have good month difference", function() {
			var date1 = moment([2013, 5, 1]);
			var date2 = moment([2013, 5, 1]);

			expect(utils.isTodayInRange(date1, date2)).toBe(true);
		});

		it("compares two dates that match in years and have good month difference", function() {
			var date1 = moment([2013, 5, 1]);
			var date2 = moment([2013, 6, 1]);

			expect(utils.isTodayInRange(date1, date2)).toBe(true);
		});

		it("compares two dates that match in years and have good month difference", function() {
			var date1 = moment([2013, 5, 1]);
			var date2 = moment([2013, 6, 1]);

			expect(utils.isTodayInRange(date2, date1)).toBe(true);
		});

		it("compares two dates that match in years but month difference is not good", function() {
			var date1 = moment([2013, 10, 1]);
			var date2 = moment([2013, 1, 1]);

			expect(utils.isTodayInRange(date1, date2)).toBe(false);
		});

		it("adds currentDayText if the day is highlighted", function() {
			var day = {day: 1, highlight: true, month: 'current'};
			utils.addCurrentDay(day);
			expect(day.currentDayText).toBe(true);
			expect(day.currentDayDiv).toBe(undefined);
		});

		it("adds currentDayDiv if the day is not highlighted", function() {
			var day = {day: 1, highlight: false, month: 'current'};
			utils.addCurrentDay(day);
			expect(day.currentDayText).toBe(undefined);
			expect(day.currentDayDiv).toBe(true);
		});
	});
});