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
		// toggleClass = makeClassListCmd("toggle");

	function existy(val) { /*jshint eqnull: true*/ return val != null; }
	function truthy(val) { return val !== false && existy(val); }


	/*
	 * create injectable classList.XXX string
	 ******************************************************************/
	function makeClassListCmd(fnStr) {
		var base = "document.body.classList.";
		return function (className) {
			return [base, fnStr, "(\"", className, "\");" ].join("");
		};
	}


	/*
	 * inject addClass script into dom and set extension icon to on
	 ******************************************************************/
	function activateToggleForTab(tabId) {

		function addClassTurnOnIcon(items) {
			executeScript({code: addClass(items.toggleClass)});
			setIcon({tabId: tabId, path: IMG_ON});
		}

		pizzaStore.load("toggleClass", addClassTurnOnIcon);
	}


	/*
	 * inject removeclass script into dom and set extension icon to off
	 ******************************************************************/
	function deactiveToggleForTab(tabId) {

		function removeClassTurnOffIcon(items) {
			executeScript({code: removeClass(items.toggleClass)});
			setIcon({tabId: tabId, path: IMG_OFF});
		}

		pizzaStore.load("toggleClass", removeClassTurnOffIcon);
	}


	/*
	 * TODO: swapClassOnTab
	 ******************************************************************/
	// function swapClassOnTab(tabId) {}

	/*
	 *
	 ******************************************************************/
	function onIconClicked(tab) {
		pizzaStore.load("mode", function (item) {

			if (item.mode ===  "toggle") {

				if (truthy(activeTabs[tab.id])) {
					activeTabs[tab.id] = false;
					deactiveToggleForTab(tab.id);
				}
				else {
					activeTabs[tab.id] = true;
					activateToggleForTab(tab.id);
				}
			}
			else if (item.mode === "swap") {
				// TODO: swap mode
			}
		});
	}


	/*
	 * When a tab is done updating (like on a refresh) add the class
	 * to the page if it was on before the refresh
	 ******************************************************************/
	function onTabUpdateComplete(tabId, changeInfo) {

		if (changeInfo.status === "complete" && truthy(activeTabs[tabId])) {
			pizzaStore.load("mode", function (item) {

				if (item.mode === "toggle" && truthy(activeTabs[tabId])) {
					activateToggleForTab(tabId);
				}
				else {
					// TODO: swap mode
				}
			});
		}
	}


	/*
	 * if a tab is closed delete active tab record
	 ******************************************************************/
	function onTabRemoved(tabId) {
		if (truthy(activeTabs[tabId])) {
			delete activeTabs[tabId];
		}
	}

	/*
	 *setup & go
	 ******************************************************************/
	pizzaStore.loadAll(function (store) {
		if (!store || !store.version || parseFloat(store.version) < pizzaStore.version) {
			pizzaStore.setDefaults();
		}

		chrome.browserAction.onClicked.addListener(onIconClicked);
		chrome.tabs.onUpdated.addListener(onTabUpdateComplete);
		chrome.tabs.onRemoved.addListener(onTabRemoved);
	});

})(window.pizzaStore);
