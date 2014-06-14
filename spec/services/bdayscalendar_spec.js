describe("service: bdays calendar", function() {
  var calendar, localstorage;

  beforeEach(module("LocalStorageModule"));
  beforeEach(module("services.bdayscalendar"));

  beforeEach(inject(function(_bdayscalendar_, _localStorageService_) {
    calendar = _bdayscalendar_;
    localstorage = _localStorageService_;
  }));

  describe("#setOptions(startDay, last, cycle, startSunday)", function() {
    it("contains the right options", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 29
      };
      calendar.setOptions(date, 6, 28, true);
      var options = calendar.getOptions();

      expect(options.startDay.year()).toEqual(2013);
      expect(options.startDay.month()).toEqual(8); // 0 based
      expect(options.startDay.date()).toEqual(29);

      expect(options.last).toEqual(6);
      expect(options.cycle).toEqual(28);
      expect(options.startSunday).toBe(true);
    });

    it("throws if you put a 'last' out of range or missing", function() {
      expect(function() { calendar.setOptions({year: 2013, month: 9, day: 29}, 0,  28) }).toThrow(new Error("The 'last' or 'cycle' is out of range or missing"));
      expect(function() { calendar.setOptions({year: 2013, month: 9, day: 29}, 10, 28) }).toThrow(new Error("The 'last' or 'cycle' is out of range or missing"));
      expect(function() { calendar.setOptions({year: 2013, month: 9, day: 29}) }).toThrow(new Error("The 'last' or 'cycle' is out of range or missing"));
    });
    it("throws if you put a 'cycle' out of range or missing", function() {
      expect(function() { calendar.setOptions({year: 2013, month: 9, day: 29}, 2, 32) }).toThrow(new Error("The 'last' or 'cycle' is out of range or missing"));
      expect(function() { calendar.setOptions({year: 2013, month: 9, day: 29}, 2, 19) }).toThrow(new Error("The 'last' or 'cycle' is out of range or missing"));
      expect(function() { calendar.setOptions({year: 2013, month: 9, day: 29}) }).toThrow(new Error("The 'last' or 'cycle' is out of range or missing"));
    });
    it("throws if the date is missing some data", function() {
      expect(function() { calendar.setOptions({}, 8, 29) }).toThrow(new Error("The 'date' is missing some data"));
      expect(function() { calendar.setOptions({year: 2013, month: 9}, 8, 29) }).toThrow(new Error("The 'date' is missing some data"));
      expect(function() { calendar.setOptions({year: 2013, day: 29}, 8, 29) }).toThrow(new Error("The 'date' is missing some data"));
      expect(function() { calendar.setOptions({month: 9, day: 29}, 8, 29) }).toThrow(new Error("The 'date' is missing some data"));
    });
    it("it puts 'startSunday' as false if it not set", function() {
      calendar.setOptions({year: 2013, month: 9, day: 29}, 1, 28 );
      var options = calendar.getOptions();
      expect(options.startSunday).toBe(false);
    });
    it("should save the options in the localstorage if available", function() {
      if(localstorage.isSupported()) { // We avoid the test to fail if there is no local storage in the testing browser
        spyOn(localstorage, 'add');
        calendar.setOptions({year: 2013, month: 9, day: 29}, 6, 28);
        expect(localstorage.add).toHaveBeenCalledWith('bdaysoptions', angular.toJson({date: {year: 2013, month: 9, day: 29}, last: 6, cycle: 28, startSunday: false}));
      };
    });
  });

  describe("#getOptions", function() {
    it("should return undefined if there is no options", function() {
      spyOn(localstorage, 'get');
      expect(calendar.getOptions()).toBe(undefined);
      expect(localstorage.get).toHaveBeenCalledWith('bdaysoptions');
    });

    it("if options is null, it should call the localstorage and return the options", function() {
      if(localstorage.isSupported()) {
        spyOn(localstorage, 'get').andReturn(angular.toJson({date: {year: 2013, month: 9, day: 29}, last: 6, cycle: 28}));
        var options = calendar.getOptions();
        expect(localstorage.get).toHaveBeenCalledWith('bdaysoptions');
        expect(options.startDay.year()).toEqual(2013);
        expect(options.startDay.month()).toEqual(8); // 0 based
        expect(options.startDay.date()).toEqual(29);

        expect(options.last).toEqual(6);
        expect(options.cycle).toEqual(28);
        expect(options.startSunday).toBe(false);
      }
    });
  });

  describe("#getCalendar(year, month)", function() {
    it("generates the calendar with the bdays highlighted", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 26
      };
      calendar.setOptions(date, 6, 28);
      var generatedCalendar = calendar.getCalendar(2013, 9);
      var expectedResult = [{highlight: true, month: "prev", day: 29 },{highlight: true, month: "prev",	day: 30},{highlight: true, month: "prev", day: 31},{highlight: true,month: "current",	day: 1},{ highlight: true, month: "current", day: 2},{ highlight: true,	month: "current",	day: 3},{	highlight: true, month: "current", day: 26},{	highlight: true, month: "current", day: 27},{highlight: true,	month: "current",	day: 28},{highlight: true,month: "current",	day: 29},{highlight: true,month: "current",	day: 30},{highlight: true,month: "next",day: 1}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(12);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("works good for a leap year", function() {
      var date = {
        year: 2012,
        month: 2,
        day: 28
      };
      calendar.setOptions(date, 6, 28);
      var generatedCalendar = calendar.getCalendar(2012, 2);
      var expectedResult = [{highlight: true, month: "prev", day: 31 },{highlight: true, month: "current",	day: 1},{highlight: true, month: "current", day: 2},{highlight: true,month: "current",	day: 3},{ highlight: true, month: "current", day: 4},{ highlight: true,	month: "current",	day: 5},{	highlight: true, month: "current", day: 28},{	highlight: true, month: "current", day: 29},{highlight: true,	month: "next",	day: 1},{highlight: true,month: "next",	day: 2},{highlight: true,month: "next",	day: 3},{highlight: true,month: "next",day: 4}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(12);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("works 3 months next to the last menstruation date", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 26
      };
      calendar.setOptions(date, 6, 28);
      var generatedCalendar = calendar.getCalendar(2013, 12);
      var expectedResult = [{highlight: true, month: "current", day: 19 },{highlight: true, month: "current",	day: 20},{highlight: true, month: "current", day: 21},{highlight: true,month: "current",	day: 22},{ highlight: true, month: "current", day: 23},{ highlight: true,	month: "current",	day: 24}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(6);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("works 3 months before to the last mensturation date", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 26
      };
      calendar.setOptions(date, 6, 28);
      var generatedCalendar = calendar.getCalendar(2013, 6);
      var expectedResult = [{highlight: true, month: "current", day: 6 },{highlight: true, month: "current",	day: 7},{highlight: true, month: "current", day: 8},{highlight: true,month: "current",	day: 9},{ highlight: true, month: "current", day: 10},{ highlight: true,	month: "current",	day: 11},{	highlight: true, month: "next", day: 4},{	highlight: true, month: "next", day: 5},{highlight: true,	month: "next",	day: 6},{highlight: true,month: "next",	day: 7}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(10);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("works with the shortest cycle and last", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 1
      };
      calendar.setOptions(date, 1, 20);
      var generatedCalendar = calendar.getCalendar(2013, 9);
      var expectedResult = [{highlight: true, month: "current", day: 1 },{highlight: true, month: "current",	day: 21}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(2);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("works with the largest cycle and shortest last", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 1
      };
      calendar.setOptions(date, 1, 31);
      var generatedCalendar = calendar.getCalendar(2013, 9);
      var expectedResult = [{highlight: true, month: "current", day: 1 }, {highlight: true, month: 'next', day: 2}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(2);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("works with the largest cycle and last", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 1
      };
      calendar.setOptions(date, 9, 31);
      var generatedCalendar = calendar.getCalendar(2013, 9);
      var expectedResult = [{highlight: true, month: "current", day: 1 },{highlight: true, month: "current",	day: 2},{highlight: true, month: "current", day: 3},{highlight: true,month: "current",	day: 4},{ highlight: true, month: "current", day: 5},{ highlight: true,	month: "current",	day: 6},{	highlight: true, month: "current", day: 7},{	highlight: true, month: "current", day: 8},{highlight: true,	month: "current",	day: 9}, {highlight: true, month: 'next', day: 2}, {highlight: true, month: 'next', day: 3}, {highlight: true, month: 'next', day: 4}, {highlight: true, month: 'next', day: 5}, {highlight: true, month: 'next', day: 6}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(14);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("works with the shortest cycle and largest last", function() {
      var date = {
        year: 2013,
        month: 9,
        day: 15
      };
      calendar.setOptions(date, 9, 20);
      var generatedCalendar = calendar.getCalendar(2013, 9);
      var expectedResult = [{highlight: true, month: "prev", day: 26 },{highlight: true, month: "prev",	day: 27},{highlight: true, month: "prev", day: 28},{highlight: true,month: "prev",	day: 29},{ highlight: true, month: "prev", day: 30},{ highlight: true,	month: "prev",	day: 31},{	highlight: true, month: "current", day: 1},{	highlight: true, month: "current", day: 2},{highlight: true,	month: "current",	day: 3}, {highlight: true, month: 'current', day: 15}, {highlight: true, month: 'current', day: 16}, {highlight: true, month: 'current', day: 17}, {highlight: true, month: 'current', day: 18}, {highlight: true, month: 'current', day: 19}, {highlight: true, month: 'current', day: 20}, {highlight: true, month: 'current', day: 21}, {highlight: true, month: 'current', day: 22}, {highlight: true, month: 'current', day: 23}, {highlight: true, month: 'next', day: 5}, {highlight: true, month: 'next', day: 6}];

      expect(generatedCalendar.bdays.length).toBe(42);
      var generatedHighlight = _.filter(generatedCalendar.bdays, function(item) { return item.highlight; }).length;
      expect(generatedHighlight).toBe(expectedResult.length);
      expect(generatedHighlight).toBe(20);
      expect(calendarContainDates(generatedCalendar, expectedResult)).toBe(true);
    });

    it("throws if we don't set the options first", function() {
      expect(function() { calendar.getCalendar(2013, 9) }).toThrow(new Error("You need to set the options first"));
    });
  });
});