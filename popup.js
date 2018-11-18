// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var checkList = ['use_gaze', 'show_gaze', 'show_face'];


// Saves options to chrome.storage
function save_options() {
	var setter = {};
	
	  checkList.forEach(function(entry){
		  setter[entry] = document.getElementById(entry).checked;
	  });

	chrome.storage.sync.set(setter, function() {
		console.log("Saved Setting");
	  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(checkList, function(items) {
	  checkList.forEach(function(entry){
		  document.getElementById(entry).checked = items[entry];
	  });
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
checkList.forEach(function(entry){
	document.getElementById(entry).addEventListener('change', save_options);
});


var lastIcon = "";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	var newIcon = request.imagePath;
	if(newIcon != lastIcon){
		lastIcon=newIcon;
		chrome.browserAction.setIcon({ path: {"128":"images/"+newIcon}});
	}
	sendResponse({farewell: "goodbye"});
  });