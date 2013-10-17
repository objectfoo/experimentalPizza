/*global chrome*/
(function (pizzaStore) {
	"use strict";

	var activeTabs = {},

		executeScript = chrome.tabs.executeScript,
		setIcon = chrome.browserAction.setIcon,

		IMG_ON    = "images/pizzaOn.png",
		IMG_OFF   = "images/pizzaOff.png",

		addClass = makeClassListCmd("add"),
		removeClass = makeClassListCmd("remove"),
		toggleClass = makeClassListCmd("toggle");

	function existy(val) { /*jshint eqnull: true*/ return val != null; }
	function truthy(val) { return val !== false && existy(val); }

	function makeClassListCmd(fnStr) {
		var base = "document.body.classList.";
		return function (className) {
			return [base, fnStr, "(\"", className, "\")" ].join("");
		}
	}

	function addToggleClass(tabId) {
		pizzaStore.load("toggleClass", function (items) {
			executeScript({code: addClass(items.toggleClass)});
			setIcon({tabId: tabId, path: IMG_ON});
		});
	}

	function removeToggleClass(tabId) {
		pizzaStore.load("toggleClass", function (items) {
			executeScript({code: removeClass(items.toggleClass)});
			setIcon({tabId: tabId, path: IMG_OFF});
		});
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
