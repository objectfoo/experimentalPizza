/*global chrome*/
(function () {
	"use strict";

	var store = chrome.storage.local,
		DEFAULTS = {
			// manifest version in case I want to add stuff later
			version: 1,
			toggleClass: "pizza",
			elementExpression: "body"
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

	function set(key, value, callback) {
		var cfg = {};
		cfg[key] = value;
		store.set(cfg, callback);
	}

	window.pizzaStore = {
		set: set,
		load: load,
		version: DEFAULTS.version,
		loadAll: loadAll,
		setDefaults: setDefaults
	};
})();
