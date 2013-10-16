/*global chrome*/
"use strict";

var toggleActionData,
	swapActionData,
	bg = chrome.extension.getBackgroundPage(),

	CSS_IS_SELECTED = "is-selected";

function setInputChecked(elementId) {
	$("#" + elementId).setAttribute("checked", true);
}

function $(expr, con) { return (con || document).querySelector(expr); }

function showOptionsForId(id) {
	if (id === "swap") {
		toggleActionData.classList.remove(CSS_IS_SELECTED);
		swapActionData.classList.add(CSS_IS_SELECTED);
	} else {
		swapActionData.classList.remove(CSS_IS_SELECTED);
		toggleActionData.classList.add(CSS_IS_SELECTED);
	}
}

function onFormChange(e) {
	var type = e.target.type, id = e.target.id;

	if (type === "radio") {
		showOptionsForId(id);
		bg.pizzaStore.set("mode", id);
	}
	else if (type === "text") {
		bg.pizzaStore.set(id, e.target.value);
	}
}

function initView(settings) {
	setInputChecked(settings.mode);
	showOptionsForId(settings.mode);
	$("#toggleClass").value = settings.toggleClass;
	$("#swapClassA").value = settings.swapClassA;
	$("#swapClassB").value = settings.swapClassB;
}

function init() {
	toggleActionData = $("#toggleActionData");
	swapActionData = $("#swapActionData");
	bg.pizzaStore.load(["mode", "toggleClass", "swapClassA", "swapClassB"], initView);
	$("body").addEventListener("change", onFormChange);
}

addEventListener("DOMContentLoaded", init);
