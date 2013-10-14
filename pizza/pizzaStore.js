/*global chrome*/
(function () {
	"use strict";

	var store = chrome.storage.local,
			STORE_KEY = "pizzaStore";

	function load(callback) {
		store.get(STORE_KEY, function (items) {
			callback(items[STORE_KEY]);
		});
	}

	function setStore(obj, callback) {
		var config = {};

		config[STORE_KEY] = obj;
		store.set(config, callback);
	}

	// function onStoreChanged (changes, area) {
	// 	callbacks.map(function (cb) {
	// 		if (isFunction(cb))
	// 			cb(changes);
	// 	});
	// }

	window.pizzaStore = {
		load: load,
		setStore: setStore
	};

})();
