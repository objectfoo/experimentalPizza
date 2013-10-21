/*global chrome*/
(function (pizzaStore) {
	"use strict";

	var activeTabs = {},

		executeScript = chrome.tabs.executeScript,
		setIcon = chrome.browserAction.setIcon,

		IMG_ON    = "images/pizzaOn.png",
		IMG_OFF   = "images/pizzaOff.png",

		addClass = makeClassListCmd("add"),
		removeClass = makeClassListCmd("remove");

	function existy(val) { /*jshint eqnull: true*/ return val != null; }
	function truthy(val) { return val !== false && existy(val); }

	function makeClassListCmd(fnStr) {
		var base = "document.body.classList.";
		return function (className) {
			return [base, fnStr, "(\"", className, "\");" ].join("");
		};
	}

	function activateToggleForTab(tabId) {

		function toggleOn(items) {
			executeScript({code: addClass(items.toggleClass)});
			setIcon({tabId: tabId, path: IMG_ON});
		}

		pizzaStore.load("toggleClass", toggleOn);
	}

	function deactiveToggleForTab(tabId) {

		function toggleOff(items) {
			executeScript({code: removeClass(items.toggleClass)});
			setIcon({tabId: tabId, path: IMG_OFF});
		}

		pizzaStore.load("toggleClass", toggleOff);
	}

	function onIconClicked(tab) {

		// do nothing on pages that don't have protocol http, https or file
		if (!/^(https?|file):\/{2,3}/.test(tab.url)) {
			return;
		}

		if (truthy(activeTabs[tab.id])) {
			activeTabs[tab.id] = false;
			deactiveToggleForTab(tab.id);
		}
		else {
			activeTabs[tab.id] = true;
			activateToggleForTab(tab.id);
		}
	}

	function onTabUpdateComplete(tabId, changeInfo) {
		if (changeInfo.status === "complete" && truthy(activeTabs[tabId])) {
			activateToggleForTab(tabId);
		}
	}

	function onTabRemoved(tabId) {
		delete activeTabs[tabId];
	}

	pizzaStore.loadAll(function (store) {
		if (!store || !store.version || parseFloat(store.version) !== pizzaStore.version) {
			pizzaStore.setDefaults();
		}

		chrome.browserAction.onClicked.addListener(onIconClicked);
		chrome.tabs.onUpdated.addListener(onTabUpdateComplete);
		chrome.tabs.onRemoved.addListener(onTabRemoved);
	});

})(window.pizzaStore);
