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

var has_started = false;

window.addEventListener('load', function(){
	createPoint(show_gaze);
	
	changeSettings();
	
	startWebGazer();
	
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		  if(request.resetGazer){
			console.log("Reset Gazer Received");
			changeSettings();
		  }
		  
		  if(request.clearData){
			  console.log("Start Clear Data");
			  webgazer.clearData();
		  }
  });
});

window.addEventListener("beforeunload", function (e) {
	webgazer.end();
});

var show_face = true;
var show_gaze = true;
var use_gaze =true;

function changeSettings(){
	chrome.storage.sync.get(['use_gaze','show_gaze', 'show_face'], function(items) {
		use_gaze = items.use_gaze;
		show_gaze = items.show_gaze;
		show_face = items.show_face;
		console.log(items.use_gaze + ", " + items.show_gaze + ", " + items.show_face);
	});
}

function startWebGazer(){
	webgazer.setRegression('ridge') /* currently must set regression and tracker */
		.setTracker('clmtrackr')
		.setGazeListener(function(data, clock) {
			if(data){
				var filtered_point = filterPoint(data.x, data.y, clock);
				
				setPointPosition(filtered_point.x,filtered_point.y);
			}
			
			updateIcon();
			
			showElements(["webgazerVideoFeed", "webgazerFaceOverlay", "webgazerFaceFeedbackBox"], show_face);
			showElements(["extensionPoint"], show_gaze);
		})
		
	webgazer.begin();
}

function updateIcon(){
	
	function changeIcon(image){
		chrome.runtime.sendMessage({imagePath: image}, function(response) {
		});
	}
	
	var feedbackBox = document.getElementById('webgazerFaceFeedbackBox');
	if(feedbackBox){
		var feedbackLocked = feedbackBox.style.border.includes("green");
		if(feedbackLocked){
			changeIcon("good128.png");
		} else {
			changeIcon("bad128.png");
		}
	}
}

function showElements(elements_to_hide, should_show){
	var mode = "none";
	if(should_show) {
		mode = "block";
	}
	elements_to_hide.forEach(function(elem){
		var el = document.getElementById(elem);
		if(el){
			el.style.display = mode;
		}
	});
}