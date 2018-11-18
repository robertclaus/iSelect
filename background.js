// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
	  	chrome.storage.sync.set({
			use_gaze: true,
			show_gaze: false,
			show_face: false,
			do_calibration: true
		}, function() {
	  });
});

var lastIcon = "";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	var newIcon = request.imagePath;
	if(newIcon && newIcon != lastIcon){
		lastIcon=newIcon;
		chrome.browserAction.setIcon({ path: {"128":"images/"+newIcon}});
	}
	sendResponse({farewell: "goodbye"});
  });