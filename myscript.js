console.log("My Extension Is Running!!!");

function keyUpHandler(event)
{
	var key = event.key || event.keyCode;
	if (key === 'Tab' || key === 9){
		findAndSelect()
	}
	event.preventDefault();
    event.stopPropagation();
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
	var shortestDistance = null;
	for (var i = 0; i < buttons.length; i++) { 
    	var rect = buttons[i].getBoundingClientRect()
    	var distance = calcDistance(rect.x,rect.y,goal.x,goal.y)
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
	chrome.storage.sync.get(['use_gaze','show_gaze', 'show_face'], function(items) {
		console.log(items.use_gaze + ", " + items.show_gaze + ", " + items.show_face);

		if(items.use_gaze){
			if(items.show_gaze){
				createPoint();
			}
			
			webgazer.setRegression('ridge') /* currently must set regression and tracker */
				.setTracker('clmtrackr')
				.setGazeListener(function(data, clock) {
					if(data){
						var filtered_point = filterPoint(data.x, data.y, clock);
						var x = filtered_point.x;
						var y = filtered_point.y;
						
						if(items.show_gaze){
							setPointPosition(x,y);
						}
					}
					
					var feedbackBox = document.getElementById('webgazerFaceFeedbackBox');
					if(feedbackBox){
						var feedbackLocked = feedbackBox.style.border.includes("green");
						if(feedbackLocked){
							changeIcon("good128.png");
							//chrome.browserAction.setIcon({ path: {"128":"images/good128.png"}});
						} else {
							changeIcon("bad128.png");
							//chrome.browserAction.setIcon({ path: {"128":"images/bad128.png"}});
						}
					}
					
					
					
					if(!items.show_face) {
						var elements_to_hide = ["webgazerVideoFeed", "webgazerFaceOverlay", "webgazerFaceFeedbackBox"];
						elements_to_hide.forEach(function(elem){
							var video_element = document.getElementById(elem);
							if(video_element){
								video_element.style.display = "none";
							}
						});
					}
				})
				.begin();
		}
	  });
	
	
});

function changeIcon(image){
	chrome.runtime.sendMessage({imagePath: image}, function(response) {
    });
}