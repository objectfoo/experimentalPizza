/*global chrome*/
(function (pizzaStore) {
	"use strict";

	var activeTabs = {},

		executeScript = chrome.tabs.executeScript,
		setIcon = chrome.browserAction.setIcon,

		ADD_PIZZA = "document.body.classList.add(\"pizza\")",
		REM_PIZZA = "document.body.classList.remove(\"pizza\")",
		IMG_ON    = "images/pizzaOn.png",
		IMG_OFF   = "images/pizzaOff.png";

	function existy(val) { /*jshint eqnull: true*/ return val != null; }
	function truthy(val) { return val !== false && existy(val); }
	function isTabLoaded(obj) { return obj.status === "complete"; }

	function isClassAActive(tabId) {
		return truthy(activeTabs[tabId]);
	}

	function addPizza(tabId) {
		activeTabs[tabId] = true;
		executeScript({code: ADD_PIZZA});
		setIcon({tabId: tabId, path: IMG_ON});
	}

	function removePizza(tabId) {
		activeTabs[tabId] = false;
		executeScript({code: REM_PIZZA});
		setIcon({tabId: tabId, path: IMG_OFF});
	}

	function togglePizza(tab) {
		// pizzaStore.load(function (items) {
		// 	console.log(items);
		// });

		if (isClassAActive(tab.id)) {
			removePizza(tab.id);
		}
		else {
			addPizza(tab.id);
		}
	}

	function onTabUpdateComplete(tabId, changeInfo) {
		if (isTabLoaded(changeInfo) && isClassAActive(tabId)) {
			addPizza(tabId);
		}
	}

	function onTabRemoved(tabId) {
		if (truthy(activeTabs[tabId])) {
			delete activeTabs[tabId];
		}
	}

	/*
	setup & go
	************************************************************************** */
	pizzaStore.loadAll(function (store) {
		if (!store ||
				!store.version ||
				parseFloat(store.version) < pizzaStore.version)
		{
			pizzaStore.setDefaults();
		}

		chrome.browserAction.onClicked.addListener(togglePizza);
		chrome.tabs.onUpdated.addListener(onTabUpdateComplete);
		chrome.tabs.onRemoved.addListener(onTabRemoved);
	});

})(window.pizzaStore);
