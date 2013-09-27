describe("service: utils", function() {
	var utils;

	beforeEach(module("services.utils"));

	beforeEach(inject(function(_utils_) {
		utils = _utils_;
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
	});
});