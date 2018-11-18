// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Saves options to chrome.storage
function save_options() {
	var use_gaze = document.getElementById('use_gazer').checked;
	chrome.storage.sync.set({
		use_gaze: use_gaze,
	  }, function() {
		console.log("Saved Setting");
	  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    use_gaze: true,
  }, function(items) {
	  document.getElementById('use_gazer').checked = items.use_gaze;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
setInterval(save_options, 500);
