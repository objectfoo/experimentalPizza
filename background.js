/*global chrome*/
(function () {
    'use strict';

    var active = {};

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
        chrome.tabs.executeScript({code: 'document.body.classList.add("pizza")'});
        chrome.browserAction.setIcon({tabId: tabId, path: "images/pizzaOn.png"});
    }

    function removePizza(tabId) {
        active[tabId] = false;
        chrome.tabs.executeScript({code: 'document.body.classList.remove("pizza")'});
        chrome.browserAction.setIcon({tabId: tabId, path: "images/pizzaOff.png"});
    }

    function togglePizza(tab) {
        if (tabHasPizza(tab.id))
            removePizza(tab.id);
        else
            addPizza(tab.id);
    }

    chrome.browserAction.onClicked.addListener(togglePizza);

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
        if (changeInfo.status === 'complete' && tabHasPizza(tabId)) {
            addPizza(tabId);
        }
    });
})();