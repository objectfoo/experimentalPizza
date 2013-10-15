/*global chrome*/
(function () {
	"use strict";

	var store = chrome.storage.local,

		currentStoreVersion = 3.0,

		KEYS = {
			VERSION: "version",
			MODE: "mode",
			TOGGLE_CLASS: "toggleClass",
			SWAP_CLASS_A: "SplitTestA",
			SWAP_CLASS_B: "SplitTestB"
		},

		MODE_TYPE = {
			SWAP: "swap",
			TOGGLE: "toggle"
		};

	function loadAll(callback) {
			var keys = Object.keys(KEYS).map(function (key) {
			return KEYS[key];
		});

		load(keys, callback);
	}

	function load(key, callback) {
		store.get(key, callback);
	}

	function setDefaults(callback) {
		var config = {};

		config[KEYS.VERSION] = currentStoreVersion;
		config[KEYS.MODE] = MODE_TYPE.TOGGLE;
		config[KEYS.TOGGLE_CLASS] = "pizza";
		config[KEYS.SWAP_CLASS_A] = "SplitTestA";
		config[KEYS.SWAP_CLASS_A] = "SplitTestB";

		console.log(store);
		store.clear();
		store.set(config, callback);
	}

	function set(key, value) {
		var cfg = {};
		cfg[key] = value;
		store.set(cfg);
	}

	window.pizzaStore = {
		set: set,
		KEYS: KEYS,
		load: load,
		version: currentStoreVersion,
		loadAll: loadAll,
		setDefaults: setDefaults
	};

	for (var key in KEYS) {
		window.pizzaStore[key] = function (callback) {
			store.get(KEYS[key], callback);
		};
	}

})();
