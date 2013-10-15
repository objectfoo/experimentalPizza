/*global chrome*/
(function () {
	"use strict";

	var store = chrome.storage.local,
		DEFAULTS = {
			version: 3.5,
			mode: "toggle",
			toggleClass: "pizza",
			swapClassA: "SplitTestA",
			swapClassB: "SplitTestB"
		};

	function loadAll(callback) {
		load(Object.keys(DEFAULTS), callback);
	}

	function load(key, callback) {
		store.get(key, callback);
	}

	function setDefaults(callback) {
		store.clear();
		store.set(DEFAULTS, callback);
	}

	function set(key, value) {
		var cfg = {};
		cfg[key] = value;
		store.set(cfg);
	}

	window.pizzaStore = {
		set: set,
		load: load,
		version: DEFAULTS.version,
		loadAll: loadAll,
		setDefaults: setDefaults
	};
})();
