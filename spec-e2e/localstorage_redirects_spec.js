describe('redirect behavior based on LocalStorage', function() {
	var ptor;

	describe('without data on LocalStorage', function() {
		ptor = protractor.getInstance();

		var storageMock = function() {
			var module = angular.module('LocalStorageModule', []);
			var fakeStorage = {
				get: function() {}
			};

			module.value('localStorageService', fakeStorage);
		};

		afterEach(function() {
    	ptor.clearMockModules();
  	});

		it('should redirect to /options when there is no data in LocalStorage', function() {
			ptor.addMockModule('LocalStorageModule', storageMock);
			browser.get('/');
			expect(browser.getCurrentUrl()).toContain('/options');
		});
	});

	describe('with data on LocalStorage', function() {
		ptor = protractor.getInstance();

		var storageMock = function() {
			var module = angular.module('LocalStorageModule', []);
			var fakeStorage = {
				get: function() {
					return angular.toJson({date: {year: 2013, month: 9, day: 29}, last: 6, cycle: 28});
				}
			};

			module.value('localStorageService', fakeStorage);
		};

		afterEach(function() {
    	ptor.clearMockModules();
  	});

		it('should redirect to /calendar when localStorage has data', function() {
			ptor.addMockModule('LocalStorageModule', storageMock);
			browser.get('/');
			expect(browser.getCurrentUrl()).toContain('/calendar');
		});
	});
});