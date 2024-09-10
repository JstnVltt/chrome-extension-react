import img from '../../assets/img/icon-34.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

let timeSpent = 0;
let startTime;
let { getUrlsTimestamp } = await chrome.storage.local.get('urlsTimestamp');
const urlsTimestamp = getUrlsTimestamp ? getUrlsTimestamp : {};
console.log("Récupération de urlTimestamp ", JSON.stringify(urlsTimestamp, null, 2));

let tabTimed;

async function checkCurrentURL() {
    let { urls } = await chrome.storage.local.get('urls');
    if (!urls) { urls = []; }

    let url = await getURL(); // Voir si ça marche
    if (urls.includes(url)) { createNotification(); }
}


async function getURL() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) { console.error("Error in background : can't retreive tab."); return; }

    return tab.url;
}

function createNotification() {
    const notificationId = 'uniqueId' + Date.now(); // Unique ID
    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: img,
        title: 'Notification Title',
        message: 'This website is blacklisted. Are you sure you want to continue ?',
        priority: 2
    });
}

chrome.alarms.create('notifyAlarm', { periodInMinutes: 0.083333333 });

// Send notifications if the current tab is blacklisted
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'notifyAlarm') { checkCurrentURL(); }
});

// Calculate time spent on tabs not in the blacklist
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    if (tabTimed) {
        const endTime = new Date().getTime();
        timeSpent = (endTime - startTime) / 1000;
        urlsTimestamp[tabTimed] += timeSpent;
    }

    tabTimed = await getURL();
    if (!urlsTimestamp[tabTimed]) urlsTimestamp[tabTimed] = 0;
    startTime = new Date().getTime();

    console.log("urlTimestamp dans onActivated : ", JSON.stringify(urlsTimestamp, null, 2));
    await chrome.storage.local.set({ urlsTimestamp: urlsTimestamp });
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
    if (startTime) {
        const endTime = new Date().getTime();
        timeSpent = (endTime - startTime) / 1000;

        if (!urlsTimestamp[tabTimed]) urlsTimestamp[tabTimed] = 0; // Just in case.
        urlsTimestamp[tabTimed] += timeSpent;

        startTime = null;
        tabTimed = null;
    }
    console.log("urlTimestamp dans onRemoved : ", JSON.stringify(urlsTimestamp, null, 2));
    await chrome.storage.local.set({ urlsTimestamp: urlsTimestamp });
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && startTime) {
        const endTime = new Date().getTime();
        timeSpent = (endTime - startTime) / 1000;

        if (!urlsTimestamp[tabTimed]) urlsTimestamp[tabTimed] = 0;
        urlsTimestamp[tabTimed] += timeSpent;

        tabTimed = tab;
        startTime = new Date().getTime();
    }
    console.log("urlTimestamp dans onUpdated: ", JSON.stringify(urlsTimestamp, null, 2));
    await chrome.storage.local.set({ urlsTimestamp: urlsTimestamp });
})

