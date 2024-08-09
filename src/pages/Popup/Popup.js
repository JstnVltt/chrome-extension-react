//cleanDebug();

let { urls } = await chrome.storage.local.get('urls');
if (!urls) { urls = [] };
printBlacklist();

const button = document.querySelector('#blacklist');
button.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) { console.error("Error in button blacklist : can't retreive tab."); return; };

    addURL(tab.url); printBlacklist();
});

const secondButton = document.querySelector('[id="remove blacklist"]');
secondButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) { console.error("Error in button remove blacklist : can't retreive tab."); return; }

    removeURL(tab.url); printBlacklist();
});



// Add the URL to chrome.storage.local.
async function addURL(urlToAdd) {
    let { urls } = await chrome.storage.local.get('urls');
    if (urls.includes(urlToAdd)) { window.alert("This website is already blacklisted!"); return; }
    const newURLs = [...urls, urlToAdd]; chrome.storage.local.set({ urls: newURLs });
}

// Remove the URL from chrome.storage.local.
async function removeURL(urlToRemove) {
    let { urls } = await chrome.storage.local.get('urls');
    if (urls.includes(urlToRemove)) { window.alert("This website is not blacklisted!"); return; }
    const newURLs = urls.filter(url => url !== urlToRemove); chrome.storage.local.set({ urls: newURLs });
}

// Update the visual blacklist
async function printBlacklist() {
    let { urls } = await chrome.storage.local.get('urls');

    const urlsList = document.querySelector('ul');
    urlsList.innerHTML = ''; urlsList.append(...urls);
}


// Clean every blacklisted websites.
function cleanDebug() {
    chrome.storage.local.set({ urls: [] });
}

await init();