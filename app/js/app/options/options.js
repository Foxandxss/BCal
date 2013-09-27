angular.module('options', ['ui.date', 'services.bdayscalendar', 'services.utils'])
	.config(function($stateProvider) {
		$stateProvider.state('options', {
			url: '/options',
			templateUrl: 'app/options/options.tpl.html',
			controller: 'OptionsCtrl',
			resolve: {
				options: function(bdayscalendar) {
					var options = bdayscalendar.getOptions();

					return options ? options : {};
				}
			}
		});
	})
	.controller('OptionsCtrl', function($scope, $state, utils, bdayscalendar, options) {
		if (_.isEmpty(options)) {
			$scope.options = {
				startDay: new Date(),
				last: 1,
				cycle: 20
			};
			$scope.canCancel = false;
		} else {
			// Since ui-date doesn't work with moment, we need to do a manual conversion to date
			$scope.options = {
				startDay: utils.fromMomentToDate(options.startDay),
				last: options.last,
				cycle: options.cycle
			};
			$scope.canCancel = true;
		}

		$scope.submitOptions = function() {
			if ($scope.optionsForm.$valid) {
				var year = $scope.options.startDay.getFullYear();
				var month = $scope.options.startDay.getMonth() + 1; // bdayscalendar is not 0 based
				var day = $scope.options.startDay.getDate();

				bdayscalendar.setOptions({year: year, month: month, day: day }, $scope.options.last , $scope.options.cycle);
				$state.go('home');
			}
		};

		$scope.cancel = function() {
			$state.go('home');
		};
	});