/*global chrome*/
"use strict";

var toggleActionData,
	swapActionData,
	bg = chrome.extension.getBackgroundPage(),

	CSS_IS_SELECTED = "is-selected";

function setInputChecked(elementId) {
	$(elementId).setAttribute("checked", true);
}

function $(expr, con) { return (con || document).querySelector(expr); }

function showOptionsForId(id) {
	if (id === "swapMode") {
		toggleActionData.classList.remove(CSS_IS_SELECTED);
		swapActionData.classList.add(CSS_IS_SELECTED);
	} else {
		swapActionData.classList.remove(CSS_IS_SELECTED);
		toggleActionData.classList.add(CSS_IS_SELECTED);
	}
}

function onFormChange(e) {
	var mode,
		type = e.target.type,
		id = e.target.id;

	if (type === "radio") {
		showOptionsForId(id);
		mode = (id === "toggleMode") ? "toggle" : "swap";
		bg.pizzaStore.set("mode", mode);
	}
	else if (type === "text") {

	}
}

function initView(store) {
	if (store.mode === "toggle") {
		setInputChecked("#toggleMode");
		showOptionsForId("toggleMode");
	} else {
		setInputChecked("#swapMode");
		showOptionsForId("swapMode");
	}
	$("#toggleClass").value = store.toggleClass;
	$("#swapClassA").value = store.swapClassA;
	$("#swapClassB").value = store.swapClassB;
}

function init() {
	toggleActionData = $("#toggleActionData");
	swapActionData = $("#swapActionData");

	$("body").addEventListener("change", onFormChange);
}

addEventListener("DOMContentLoaded", init);
