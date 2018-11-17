console.log("My Extension Is Running!!!");

function keyUpHandler(event)
{
	var key = event.key || event.keyCode;
	if (key === 'Tab' || key === 9){
		findAndSelect()
	}
}

document.addEventListener('keyup', keyUpHandler);

function findAndSelect()
{
	var bestElement = findClosestElement(100,100)
	bestElement.focus()
}

function findClosestElement(goalX,goalY)
{
	var buttons = document.getElementsByTagName("button"); 
	var shortestDistance = null;
	for (var i = 0; i < buttons.length; i++) { 
    	var rect = buttons[i].getBoundingClientRect()
    	var distance = calcDistance(rect.x,rect.y,goalX,goalY)
    	if (distance < shortestDistance || shortestDistance == null) { 
        	shortestDistance = distance;
        	closestEl = buttons[i]
    	}
	}
	return closestEl;
}

function calcDistance (x1, y1, x2, y2) {
  var deltaX = Math.abs(x1-x2);
  var deltaY = Math.abs(y1-y2);
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
	console.log("Hello Robert");
	createPoint();
	
	webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            console.log("data returned: "+data);
			if(data){
				var x = data.x;
				var y = data.y;
				console.log(x+","+y);
				setPointPosition(x,y);
			}        
		})
        .begin();
});