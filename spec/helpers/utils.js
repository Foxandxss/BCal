var calendarContainDates = function(original, expected) {
	var result = true; // It is true unless one of the expected keys is not there
	index = {};
	original.bdays.map(function (v) {
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