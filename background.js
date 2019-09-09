'use strict';
var browserAction = chrome.browserAction;
var cookies = chrome.cookies;

var cookieName = "XDEBUG_SESSION";
var cookieValue = "PHPSTORM";

var setBadage = function (tabId, text, color, title) {
    browserAction.setBadgeText({
        text: text,
        tabId: tabId
    });

    browserAction.setBadgeBackgroundColor({
        color: color,
        tabId: tabId
    });

    browserAction.setTitle({
        title: title,
        tabId: tabId
    });
};

var enableXdebug = function (tab) {
    cookies.set({
        url: tab.url,
        name: cookieName,
        value: cookieValue
    }, function (cookie) {
        if (cookie !== undefined) {
            setBadage(tab.id, 'On', '#2ecc71', 'Enable Debugging');
        } else {
            setBadage(tab.id, 'Err', '#95a5a6', 'Error');
        }
    });
};

var disableXdebug = function (tab) {
    cookies.remove({
        url: tab.url,
        name: cookieName
    }, function (detail) {
        if (detail !== undefined) {
            setBadage(tab.id, 'Off', '#e67e22', 'Disable Debugging');
        } else {
            setBadage(tab.id, 'Err', '#95a5a6', 'Error');
        }
    });
};

var gotCookie = function (tab, cookie) {
    if (cookie === undefined) {
        return;
    }

    if (cookie === null || cookie.value !== cookieValue) {
        enableXdebug(tab);
    } else {
        disableXdebug(tab);
    }
};

var toggleXdebug = function (tab) {
    cookies.get({
        url: tab.url,
        name: cookieName
    }, gotCookie.bind(null, tab));
};

var onActionClicked = function (tab) {
    toggleXdebug(tab);
};

browserAction.onClicked.addListener(onActionClicked);
