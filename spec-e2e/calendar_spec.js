var moment = require('./helpers/moment');

describe("calendar page", function() {
	var ptor;

	var storageMock = function() {
		var module = angular.module('LocalStorageModule', []);
		var fakeStorage = {
			get: function() {
				return angular.toJson({date: {year: 2013, month: 9, day: 29}, last: 6, cycle: 28});
      },
      set: function() {}
		};

		module.value('localStorageService', fakeStorage);
	};

	beforeEach(function() {
		ptor = protractor.getInstance();
		ptor.addMockModule('LocalStorageModule', storageMock);
		browser.get('/calendar');
	});

	afterEach(function() {
  	ptor.clearMockModules();
	});

	it('should be on the actual month', function() {
		var expectedHeader = moment().format('MMMM, YYYY');
		var header = element(by.binding('{{header}}')).getText();
    expect(header).toBe(expectedHeader);
	});

  it('can go to the next month', function() {
    var expectedHeader = moment().add('months', 1).format('MMMM, YYYY');
    var nextbutton = element(by.id('right'));
    nextbutton.click();
    var header = element(by.binding('{{header}}')).getText();
    expect(header).toBe(expectedHeader);
  });

  it('can go to the next month', function() {
    var expectedHeader = moment().subtract('months', 1).format('MMMM, YYYY');
    var nextbutton = element(by.id('left'));
    nextbutton.click();
    var header = element(by.binding('{{header}}')).getText();
    expect(header).toBe(expectedHeader);
  });

  it('can go to the options page', function() {
    element(by.id('optionsButton')).click();
    expect(browser.getCurrentUrl()).toContain('/options');
  });

  it('can go to specific month via URL', function() {
    var expectedHeader = moment([2006, 10, 1]).format('MMMM, YYYY'); // November (0 based)
    browser.get('/calendar/2006/11'); // 1 based
    var header =  element(by.binding('{{header}}')).getText();
    expect(header).toBe(expectedHeader);

  });

});