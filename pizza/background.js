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

	function isClassAActive(tabId) {
		return truthy(activeTabs[tabId]);
	}

	function addToggleClass(tabId) {
		executeScript({code: ADD_PIZZA});
		setIcon({tabId: tabId, path: IMG_ON});
	}

	function removeToggleClass(tabId) {
		executeScript({code: REM_PIZZA});
		setIcon({tabId: tabId, path: IMG_OFF});
	}

	function toggleOnTab(tabId) {
		if (truthy(activeTabs[tabId])) {
			activeTabs[tabId] = false;
			removeToggleClass(tabId);
		} else {
			activeTabs[tabId] = true;
			addToggleClass(tabId);
		}
	}

	function swapOnTab(tabId) {}

	function onIconClicked(tab) {
		chrome.permissions.contains({origins: [tab.url]}, function (allowed) {
			if (!allowed) return;

			pizzaStore.load("mode", function (item) {
				if (item.mode ===  "toggle") {
					toggleOnTab(tab.id);
				}
				else if (item.mode === "swap") {

				}
			});
		});
	}

	function doIfPermissionForUrl(url, callback) {
		chrome.permissions.contains({origins: [url]}, function (allowed) {
			if (allowed) callback();
		});
	}

	function updateClassOnTab() {
		pizzaStore.load("mode", function (item) {
			if (item.mode === "toggle") {
				if (truthy(activeTabs[tabId])) {
					addToggleClass(tabId);
				}
				else {
					removeToggleClass(tabId);
				}
			}
			else {
				// swap mode
			}
		});
	}

	function onTabUpdateComplete(tabId, changeInfo, tab) {
		if (changeInfo.status === "complete" && truthy(activeTabs[tabId])) {
			doIfPermissionForUrl(tab.url, updateClassOnTab);
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
		if (!store || !store.version || parseFloat(store.version) < pizzaStore.version) {
			pizzaStore.setDefaults();
		}

		chrome.browserAction.onClicked.addListener(onIconClicked);
		chrome.tabs.onUpdated.addListener(onTabUpdateComplete);
		chrome.tabs.onRemoved.addListener(onTabRemoved);
	});

})(window.pizzaStore);
