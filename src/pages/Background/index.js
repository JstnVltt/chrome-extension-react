import img from '../../assets/img/icon-34.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');


async function checkCurrentURL() {
    let { urls } = await chrome.storage.local.get('urls');
    if (!urls) { urls = []; }

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) { console.error("Error in background : can't retreive tab."); return; }

    if (urls.includes(tab.url)) { createNotification(); }
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

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'notifyAlarm') { checkCurrentURL(); }
});
