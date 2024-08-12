//cleanDebug();

/* let { urls } = await chrome.storage.local.get('urls');
if (!urls) { urls = [] };
printBlacklist(); */

// Add the URL to chrome.storage.local.
export default async function addURL(urlToAdd) {
    let { urls } = await chrome.storage.local.get('urls');
    if (urls.includes(urlToAdd)) { window.alert("This website is already blacklisted!"); return; }
    const newURLs = [...urls, urlToAdd]; await chrome.storage.local.set({ urls: newURLs });
}

// Remove the URL from chrome.storage.local.
export async function removeURL(urlToRemove) {
    let { urls } = await chrome.storage.local.get('urls');
    if (urls.includes(urlToRemove)) { window.alert("This website is not blacklisted!"); return; }
    const newURLs = urls.filter(url => url !== urlToRemove); await chrome.storage.local.set({ urls: newURLs });
}

// Update the visual blacklist
export async function printBlacklist() {
    let { urls } = await chrome.storage.local.get('urls');

    const urlsList = document.querySelector('ul');
    urlsList.innerHTML = ''; urlsList.append(...urls);
}


// Clean every blacklisted websites.
function cleanDebug() {
    chrome.storage.local.set({ urls: [] });
}

// await init();