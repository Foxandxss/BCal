describe "directive: Calendar", ->

	Given -> module "directives.calendar"

	Given inject (_$rootScope_, _$compile_) ->
		@$rootScope = _$rootScope_
		@$compile = _$compile_
		@elem = '<calendar year="2013" month="5"></calendar>'
		@scope = @$rootScope.$new()
		@elem = @$compile(@elem)(@scope)

	describe "contains the days of the current month with previous and next month days to fill", ->
		
		describe "with the date defined", ->
			Then "the days array has all the needed days", ->
				expect(@scope.days.length).toBe 42
			Then "the first day will be 29 of April", ->
				@expect(_.first(@scope.days).day).toBe 29
			Then "the last day will be 9 of June", ->
				@expect(_.last(@scope.days).day).toBe 9

		describe "with the default date defined", ->
			Given ->
				@elem = '<calendar></calendar>'
				@scope = @$rootScope.$new()
				@elem = @$compile(@elem)(@scope)

			Then "the days array has all the needed days", ->
				expect(@scope.days.length).toBe 42
			Then "the first day will be 26 of August", ->
				@expect(_.first(@scope.days).day).toBe 26
			Then "the last day will be 6 of October", ->
				@expect(_.last(@scope.days).day).toBe 6