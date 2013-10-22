/*global chrome*/
"use strict";

var pizzaStore = chrome.extension.getBackgroundPage().pizzaStore,
	$bd = $("body");

function $(expr, con) { return (con || document).querySelector(expr); }

function onFormChange(e) {
	var id = e.target.id;

	pizzaStore.set(id, e.target.value, fakeSave);
}

function fakeSave() {
	$bd.classList.add("fake-save");
	setTimeout(function () {
		$bd.classList.remove("fake-save");
	}, 500);
}

function initView(settings) {
	$("#toggleClass").value = settings.toggleClass;
	$("#elementExpression").value = settings.elementExpression;

	$bd.addEventListener("change", onFormChange);
	$("button").addEventListener("click", fakeSave);
}

function init() {
	pizzaStore.load(["toggleClass", "elementExpression"], initView);
}

addEventListener("DOMContentLoaded", init);
