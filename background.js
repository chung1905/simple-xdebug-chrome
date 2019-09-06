'use strict';
var browserAction = chrome.browserAction;
var cookies = chrome.cookies;

var cookieName = "XDEBUG_SESSION";
var cookieValue = "PHPSTORM";
var enableDebugText = "Enable Debugging";
var disableDebugText = "Disable Debugging";

var enableXdebug = function (tab) {
    cookies.set({
        url: tab.url,
        name: cookieName,
        value: cookieValue
    });

    browserAction.setBadgeText({
        text: "On",
        tabId: tab.id
    });

    browserAction.setBadgeBackgroundColor({
        color: '#2ecc71',
        tabId: tab.id
    });

    browserAction.setTitle({
        title: disableDebugText,
        tabId: tab.id
    });
};

var disableXdebug = function (tab) {
    cookies.remove({
        url: tab.url,
        name: cookieName
    });

    browserAction.setBadgeText({
        text: "Off",
        tabId: tab.id
    });

    browserAction.setBadgeBackgroundColor({
        color: '#e67e22',
        tabId: tab.id
    });

    browserAction.setTitle({
        title: enableDebugText,
        tabId: tab.id
    });
};

var gotCookie = function (cookie) {
    if (cookie === null || cookie.value !== cookieValue) {
        enableXdebug(this);
    } else {
        disableXdebug(this);
    }
};

var toggleXdebug = function (tab) {
    cookies.get({
        url: tab.url,
        name: cookieName
    }, gotCookie.bind(tab));
};

var onActionClicked = function (tab) {
    toggleXdebug(tab);
};

browserAction.onClicked.addListener(onActionClicked);
