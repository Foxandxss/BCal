describe('redirect behavior based on LocalStorage', function() {
  var ptor;

  var storageMock = function() {
    var module = angular.module('LocalStorageModule', []);
    var fakeStorage = {
      get: function() {
        return angular.toJson({date: {year: 2013, month: 9, day: 29}, last: 6, cycle: 28, startSunday: true});
      },
      isSupported: function() { return false; }
    };

    module.value('localStorageService', fakeStorage);
  };

  beforeEach(function() {
    ptor = protractor.getInstance();
    ptor.addMockModule('LocalStorageModule', storageMock);
    browser.get('/options');
  });

  afterEach(function() {
    ptor.clearMockModules();
  });

  it('should contain the saved date on the input', function() {
    var input = element(by.model('options.startDay'));
    expect(input.getAttribute('value')).toBe('09/29/2013');
  });

  it('should contain a select box with the saved period last selected', function() {
    var select = element(by.selectedOption('options.last'));
    expect(select.getText()).toEqual('6');
  });

  it('should contain a select box with the saved cycle selected', function() {
    var select = element(by.selectedOption('options.cycle'));
    expect(select.getText()).toEqual('28');
  });

  it('should contain a checkbox with the saved start-sunday selected', function() {
    var checkbox = element(by.model('options.startSunday'));
    expect(checkbox.getAttribute('checked')).toBe('true');
  });

  it('should go to the calendar upon cancel', function() {
    element(by.buttonText('Cancel')).click();
    expect(browser.getCurrentUrl()).toContain('/calendar');
  });

  it('should go to the calendar upon submit', function() {
    element(by.buttonText('Submit')).click();
    expect(browser.getCurrentUrl()).toContain('/calendar');
  });
});