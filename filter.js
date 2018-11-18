
var P = 0.50;
var I = 0.50;
var D = 20.0;

var values = [];
var valueDepth = 20;
var derivativeMin = 150*D;

var current_point = {x:0, y:0, t:0};

var lastTime = 0;

function filterPoint(x, y, time){
	var new_value = {
		x: x,
		y: y,
		t: time
	};
	
	_updateValues(new_value);
	
	var average_value = {
		x: _calculateFilter('x'),
		y: _calculateFilter('y'),
		t: time
	};
	
	current_point = average_value;
	
	_replaceLastValue(current_point);
	
	return average_value;
}

function _calculateFilter(axis){
	var final_index = values.length-1;
	var principle = values[final_index][axis];
	
	var all_sum = 0;
	values.forEach(function(value, ind) {
		all_sum += value[axis];
	});
	
	var average = all_sum/values.length;
	
	var integral = average;
	var derivative = average - values[final_index][axis];
	
	if(derivative < derivativeMin) {
		derivative = 0;
	}
	
	var Pr = principle*P;
	var In = integral*I;
	var De = derivative*D;
	
	return Pr + In + De;
}

function _updateValues(new_point){
	lastTime = new_point.time;
	
	values.push(new_point);
	
	if(values.length > valueDepth){
		values.shift();
	}
}

function _replaceLastValue(replacement_point){
	values.pop();
	values.push(replacement_point);
}