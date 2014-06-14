angular.module('services.bdayscalendar', ['services.calendar', 'services.moment', 'LocalStorageModule'])
  .service('bdayscalendar', function(calendar, moment, localStorageService) {
    var options;

    this.setOptions = function(startDay, last, cycle, startSunday) {
      if(!startDay.year || !startDay.month || !startDay.day) {
        throw new Error("The 'date' is missing some data");
      }

      if (!last || !cycle || (last < 1 || last > 9) || (cycle < 20 || cycle > 31))
      {
        throw new Error("The 'last' or 'cycle' is out of range or missing");
      }

      // if we have local storage support, save the data
      if(localStorageService.isSupported()) {
        localStorageService.add('bdaysoptions', angular.toJson({date: startDay, last: last, cycle: cycle, startSunday: !!startSunday}));
      }

      options = buildOptions(startDay, last, cycle, !!startSunday);
    };

    this.getOptions = function() {
      if (options) { // We already have the options
        return options;
      } else {
        var storedOptions = angular.fromJson(localStorageService.get('bdaysoptions'));
        if (storedOptions) { // We have saved options?
          options = buildOptions(storedOptions.date, storedOptions.last, storedOptions.cycle, storedOptions.startSunday || false);
          return options;
        } else { // We don't
          return undefined;
        }
      }
    };

    this.getCalendar = function(year, month) {
      if(!options) {
        throw new Error("You need to set the options first");
      }
      var requestedDate = moment([year, month - 1, 1]);
      var genCalendar = calendar.getCalendar(year, month, options.startSunday);
      var bdays = calculatePeriod(requestedDate);
      return decorateCalendar(genCalendar, bdays, requestedDate);
    };

    var buildOptions = function(date, last, cycle, startSunday) {
      var momentDate = moment([date.year, date.month - 1, date.day]); // 0 based

      return {
        startDay: momentDate,
        last: last,
        cycle: cycle,
        startSunday: startSunday
      };
    };

    var calculatePeriod = function(date) {
      var bdays = [];
      var temporaryOptions = angular.copy(options);
      while (true) {
        // Check if we are on the date provided in the options, if not, we need to go there
        if ((temporaryOptions.startDay.month() !== date.month()) || (temporaryOptions.startDay.year() !== date.year())) {
          if (date > temporaryOptions.startDay) {
            temporaryOptions.startDay.add('days', temporaryOptions.cycle);
          } else {
            temporaryOptions.startDay.subtract('days', temporaryOptions.cycle);
          }
        }

        // So we are on the month, but maybe we can get an early date
        else if ((temporaryOptions.startDay.month() === date.month() || temporaryOptions.startDay.year() === date.year()) && (temporaryOptions.startDay.date() > temporaryOptions.cycle)) {
          temporaryOptions.startDay.subtract('days', temporaryOptions.cycle);
        }
        // All set, time to calculate the bdays
        else {
          // All the setup is done
          break;
        }
      }
      // So we are on the first day of the month that starts a cycle but... Maybe the last month days are on a cycle too?
      var tempDate = moment(temporaryOptions.startDay).subtract('days', temporaryOptions.cycle);
      // We add an entire cycle for the last month, even for those days we don't actually see (those are ignored later)
      angular.forEach([_.range(0, temporaryOptions.last)], function() {
        bdays.push({
          highlight: true,
          month: "prev",
          day: tempDate.date()
        });
        tempDate.add('days', 1);
      });

      // We check if she had a cycle that span two different months
      if (temporaryOptions.startDay.date() > (temporaryOptions.cycle - temporaryOptions.last +1)) { // AKA she has menstruation in day 1 but is not the first day of the cycle
        var bdaysThisMonth = temporaryOptions.startDay.date() - (temporaryOptions.cycle - temporaryOptions.last + 1); // Days from this month
        var bdaysLastMonth = temporaryOptions.last - bdaysThisMonth; // Days from the last month
        var lastMonthDays = moment([date.year(), date.month() - 1, 1]).daysInMonth(); // We need to know what's the last day of the month

        // Time to add the last month days
        angular.forEach(_.range(0, bdaysLastMonth), function() {
          bdays.push({
            highlight: true,
            month: "prev",
            day: lastMonthDays
          });
          lastMonthDays--;
        });

        // Now this month days
        angular.forEach(_.range(0, bdaysThisMonth), function(day) {
          bdays.push({
            highlight: true,
            month: "current",
            day: day+1 // We don't want this 0 based
          });
        });
      }

      // Now is time for the current month and the next month
      var isNext = false; // We need to know if we moved to the next month
      angular.forEach(_.range(0, temporaryOptions.last), function() {
        if (isNext) {
          bdays.push({
            highlight: true,
            month: 'next',
            day: temporaryOptions.startDay.date()
          });
        } else {
          bdays.push({
            highlight: true,
            month: 'current',
            day: temporaryOptions.startDay.date()
          });
        }
        temporaryOptions.startDay.add('days', 1);
        if (temporaryOptions.startDay.date() === 1) { // AKA we are on the next month
          isNext = true;
        }
      });

      isNext = false;

      // Is there more bloody days this month?
      temporaryOptions.startDay.add('days', temporaryOptions.cycle - temporaryOptions.last);
      if (temporaryOptions.startDay.month() === date.month()) { // Seems so
        angular.forEach(_.range(0, temporaryOptions.last), function() {
          if (isNext) {
            bdays.push({
              highlight: true,
              month: 'next',
              day: temporaryOptions.startDay.date()
            });
          } else {
            bdays.push({
              highlight: true,
              month: 'current',
              day: temporaryOptions.startDay.date()
            });
          }
          temporaryOptions.startDay.add('days', 1);
          if (temporaryOptions.startDay.date() === 1) { // AKA we are on the next month
            isNext = true;
          }
        });
      } else { // Well, that month has no more bloody days, but... what about the next month?
        angular.forEach(_.range(0, temporaryOptions.last), function() {
          bdays.push({
            highlight: true,
            month: 'next',
            day: temporaryOptions.startDay.date()
          });
          temporaryOptions.startDay.add('days', 1);
        });
      }
      return bdays;
    };

    var decorateCalendar = function(genCalendar, bdays, requestedDate) {
      var result = {};

      result['bdays'] = mergeBdays(genCalendar, bdays);
      result['date'] = requestedDate;

      return result;
    };

    var mergeBdays = function(genCalendar, bdays) {
      // Index original objects by unique key
      var index = {};
      genCalendar.map(function (v) {
        index['' + v.month + '|' + v.day] = v;
      });

      // Highlight if key exists in index
      bdays.map(function (v) {
        var key = '' + v.month + '|' + v.day;
        if (index.hasOwnProperty(key)) {
          index[key].highlight = true;
        }
      });

      return genCalendar;
    };
  });