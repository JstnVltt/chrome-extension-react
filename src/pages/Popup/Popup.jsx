import React from 'react';
import { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  useEffect(() => {
    // Trouve un moyen de passer isBlacklisted à true si l'url actuelle est dans la liste des urls
    // Tu peux utiliser chrome.storage.local.get('urls') pour obtenir la liste des urls
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {isBlacklisted ? (
          <p>Ce site est déjà blacklisté</p>
        ) : (
          <button onClick={async () => addURL()}>Add URL</button>
        )}

        <button
          onClick={async () => {
            const urls = await chrome.storage.local.get('urls');
            console.log(urls);
          }}
        >
          read list
        </button>
      </header>
    </div>
  );
};

export default Popup;

async function addURL() {
  const urlToAdd = await getURL();
  const { urls } = await chrome.storage.local.get('urls');
  console.log(JSON.stringify(urls));

  if (urls.includes(urlToAdd)) {
    console.log('This website is already blacklisted!');
    return;
  }

  const newURLs = [...urls, urlToAdd];
  await chrome.storage.local.set({ urls: newURLs });
}

async function getURL() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.url;
}
