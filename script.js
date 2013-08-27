// Called when the user clicks on the browser action icon.
var active = false;

function addPizza() {
    active = true;
    chrome.tabs.executeScript({
        code: 'document.body.classList.add("pizza")'
    });
    chrome.browserAction.setIcon({path:"images/pizzaOn.png"});
}

function removePizza() {
    active = false;
    chrome.tabs.executeScript({
        code: 'document.body.classList.remove("pizza")'
    });
    chrome.browserAction.setIcon({path:"images/pizzaOff.png"});
}

function togglePizza(hasPizza) {
    if (!active) {
        addPizza();
    } else {
        removePizza();
    }
}

chrome.browserAction.onClicked.addListener(togglePizza);
