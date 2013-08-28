/*global chrome*/
(function () {
    "use strict";

    var active = {},
        ADD_PIZZA = "document.body.classList.add('pizza')",
        REM_PIZZA = "document.body.classList.remove('pizza')",
        IMG_ON    = "images/pizzaOn.png",
        IMG_OFF   = "images/pizzaOff.png";

    function existy(val) {
        /*jshint eqnull: true*/
        return val != null;
    }

    function truthy(val) {
        return val !== false && existy(val);
    }

    function tabHasPizza(tabId) {
        return truthy(active[tabId]);
    }

    function addPizza(tabId) {
        active[tabId] = true;
        chrome.tabs.executeScript({code: ADD_PIZZA});
        chrome.browserAction.setIcon({tabId: tabId, path: IMG_ON});
    }

    function removePizza(tabId) {
        active[tabId] = false;
        chrome.tabs.executeScript({code: REM_PIZZA});
        chrome.browserAction.setIcon({tabId: tabId, path: IMG_OFF});
    }

    function togglePizza(tab) {
        if (tabHasPizza(tab.id)) {
            removePizza(tab.id);
        }
        else {
            addPizza(tab.id);
        }
    }

    function onTabUpdateComplete(tabId, changeInfo) {
        if (changeInfo.status === "complete" && tabHasPizza(tabId)) {
            addPizza(tabId);
        }
    }

    function onTabRemoved(tabId) {
        return truthy(active[tabId]) && delete active[tabId];
    }

    chrome.browserAction.onClicked.addListener(togglePizza);
    chrome.tabs.onUpdated.addListener(onTabUpdateComplete);
    chrome.tabs.onRemoved.addListener(onTabRemoved);
})();
