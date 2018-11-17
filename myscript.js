console.log("My Extension Is Running!!!");

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