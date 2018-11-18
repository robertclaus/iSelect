console.log("My Extension Is Running!!!");
var previous_point = {x:0, y:0, t:0};
var _tabResetDist = 100;

function keyUpHandler(event)
{
	var key = event.key || event.keyCode;
	if (key === 'Tab' || key === 9){
		if (calcDistance(previous_point,current_point) > _tabResetDist)
		{
			findAndSelect()
			event.preventDefault();
    		event.stopPropagation();
		}
		previous_point = current_point;
	}
}

document.addEventListener('keydown', keyUpHandler);

function findAndSelect()
{
	var bestElement = findClosestElement(current_point)
	bestElement.focus()
}

function findClosestElement(goal)
{
	var buttons = document.getElementsByTagName("button");
	var anchors = document.getElementsByTagName("a");
	var inputs = document.getElementsByTagName("input");
	var selects = document.getElementsByTagName("select");
	var textAreas = document.getElementsByTagName("textarea");
	var elementsByType = {buttons,anchors,inputs,selects,textAreas};
	var shortestDistance = null;

	for (var type = 0; type < elementsByType.length; type++)
	{
		var elements = elementsByType[i];
		for (var el = 0; el < elements.length; el++) { 
    		var pos = elements[el].getBoundingClientRect()
    		var distance = calcDistance(pos,goal)
    		if (distance < shortestDistance || shortestDistance == null) { 
        		shortestDistance = distance;
        		closestEl = elements[i]
    		}
		}
	}
	return closestEl;
}

function calcDistance (pos1, pos2) {
  var deltaX = Math.abs(pos1.x-pos2.x);
  var deltaY = Math.abs(pos1.y-pos2.y);
  var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  return (dist);
};

function createPoint(){
	var canvas = document.createElement('canvas');

	canvas.id = "extensionPoint";
	canvas.width = 15;
	canvas.height = 15;
	canvas.style.zIndex = 10000;
	canvas.style.position = "absolute";
	
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(6,6,4,0,2*Math.PI);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.stroke();
	
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(canvas);
}

function setPointPosition(x, y){
	var canvas = document.getElementById('extensionPoint');
	canvas.style.left = x + 'px';
	canvas.style.top = y + 'px';
}

window.addEventListener('load', function(){
	var use_gaze = true;
	chrome.storage.sync.get({
		use_gaze: true,
		  }, function(items) {
			  use_gaze = items.use_gaze;
		  });
	
	createPoint();
	
	if(use_gaze){
		webgazer.setRegression('ridge') /* currently must set regression and tracker */
			.setTracker('clmtrackr')
			.setGazeListener(function(data, clock) {
				if(data){
					var filtered_point = filterPoint(data.x, data.y, clock);
					var x = filtered_point.x;
					var y = filtered_point.y;
					
					setPointPosition(x,y);
				}        
			})
			.begin();
	}
});