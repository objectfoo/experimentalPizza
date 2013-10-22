/*global chrome*/
(function (pizzaStore) {
	"use strict";

	var activeTabs = {},

		executeScript = chrome.tabs.executeScript,
		setIcon = chrome.browserAction.setIcon,

		IMG_ON    = "images/pizzaOn.png",
		IMG_OFF   = "images/pizzaOff.png";

	function existy(val) { /*jshint eqnull: true*/ return val != null; }
	function truthy(val) { return val !== false && existy(val); }

	function makeCommand(action, elementExpression, className) {
		var cmd =
			"Array.prototype.forEach.call(" +
				"document.querySelectorAll(\"{elementExpression}\"), " +
				"function (el) {" +
					"el.classList.{action}(\"{className}\");" +
				"});";

		return cmd.replace("{elementExpression}", elementExpression)
			.replace("{action}", action)
			.replace("{className}", className);
	}

	function activateToggleForTab(tabId) {

		function toggleOn(items) {
			var cmd = makeCommand("add", items.elementExpression, items.toggleClass);

			executeScript({code: cmd});
			setIcon({tabId: tabId, path: IMG_ON});
		}

		pizzaStore.load(["toggleClass", "elementExpression"], toggleOn);
	}

	function deactiveToggleForTab(tabId) {

		function toggleOff(items) {
			var cmd = makeCommand("remove", items.elementExpression, items.toggleClass);

			executeScript({code: cmd});
			setIcon({tabId: tabId, path: IMG_OFF});
		}

		pizzaStore.load(["toggleClass", "elementExpression"], toggleOff);
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
