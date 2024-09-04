import React from 'react';
import { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [urls, setUrls] = useState([]);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  useEffect(() => {

    async function updateUrls() {
      const { urls } = await chrome.storage.local.get('urls');
      const realUrls = urls ? urls : [];
      if (realUrls == []) await chrome.storage.local.set({ urls: [] });
      setUrls(realUrls);
    }
    updateUrls();

    async function checkBlacklisted() {
      const bool = await isURLAdded();
      bool ? setIsBlacklisted(true) : setIsBlacklisted(false);
    }
    checkBlacklisted();
  }, []);




  return (
    <div className="App">
      <header className="App-header">
        {isBlacklisted ? (
          <button onClick={async () => removeURL()}>Remove this website from blacklist</button>
        ) : (
          <button onClick={async () => addURL()}>Blacklist this website</button>
        )}

        <ul>
          {
            urls.map((url) =>
              <li key={url}>{url}</li>
            )}
        </ul>
      </header>
    </div>
  );
};

export default Popup;

// Js functions
async function addURL() {
  const urlToAdd = await getURL();
  const { urls } = await chrome.storage.local.get('urls');
  if (urls.includes(urlToAdd)) { console.log('This website is already blacklisted!'); return; }

  const newURLs = [...urls, urlToAdd];
  await chrome.storage.local.set({ urls: newURLs });
}

async function removeURL() {
  const urlToRemove = await getURL();
  const { urls } = await chrome.storage.local.get('urls');
  if (!urls.includes(urlToRemove)) { console.log("This website is not blacklisted!"); return; }

  const newURLs = urls.filter(url => url !== urlToRemove); await chrome.storage.local.set({ urls: newURLs });
}

async function getURL() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) { console.error("Error in background : can't retreive tab."); return; }

  return tab.url;
}

async function isURLAdded() {
  const currentURL = await getURL();
  const { urls } = await chrome.storage.local.get('urls');

  if (urls.includes(currentURL)) { return true; }
  return false;
}

/* function cleanDebug() {
  chrome.storage.local.set({ urls: [] });
} */
