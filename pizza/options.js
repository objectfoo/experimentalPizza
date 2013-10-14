/*global chrome*/
"use strict";

var toggleActionData,
		swapActionData,
		bg = chrome.extension.getBackgroundPage(),

		CSS_IS_NOT_SELECTED = "is-not-selected";

function setInputChecked(elementId) {
	$(elementId).setAttribute("checked", true);
}

function $(expr, con) { return (con || document).querySelector(expr); }


function activateSwap() {
	toggleActionData.classList.add(CSS_IS_NOT_SELECTED);
	swapActionData.classList.remove(CSS_IS_NOT_SELECTED);
}

function activateToggle() {
	swapActionData.classList.add(CSS_IS_NOT_SELECTED);
	toggleActionData.classList.remove(CSS_IS_NOT_SELECTED);
}

function selectOption(e) {
	var target = e.target;

	if (target.nodeName !== "INPUT") return;

	if (target.id === "swapMode")
		activateSwap();
	else
		activateToggle();
}

function initView(store) {

	if (store.mode === "toggle") {
		setInputChecked("#toggleMode");
		activateToggle();
	}
	else {
		setInputChecked("#swapMode");
		activateSwap();
	}
	$("#toggleClass").value = store.toggleClass;
	$("#swapClassA").value = store.swapClassA;
	$("#swapClassB").value = store.swapClassB;
}

function init() {
	toggleActionData = $("#toggleActionData");
	swapActionData = $("#swapActionData");
	bg.pizzaStore.load(initView);

	$("#settings").addEventListener("change", selectOption);
}

addEventListener("DOMContentLoaded", init);
