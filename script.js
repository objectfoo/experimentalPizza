// Called when the user clicks on the browser action icon.
var active = false,
    pizza = 'pizza';

function addPizza() {
    active = true;
    document.body.classList.add(pizza);
}

function removePizza() {
    active = false;
    document.body.classList.remove(pizza);
}

function togglePizza() {
    if (active) {
        addPizza();
    } else {
        removePizza();
    }
}

chrome.browserAction.onClicked.addListener(togglePizza);