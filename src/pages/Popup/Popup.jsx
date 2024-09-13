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

        <button onClick={async () => recommandURL()}>Recommand me a website to blacklist (AI)</button>


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

async function recommandURL() {
  const urlsTimestamp = chrome.storage.local.get('urlsTimestamp');
  const prompt = `I am a javascript program. I have a dictionnary of urls named "Dictionnary" linked to the time spent by the user on each of them. 
  My objective is to find urls to blacklist to make the user more productive. I will give you this dictionnary and I want you to take in account the time associated with each url, 
  as well as the type of url in regard of being productive, and give me in response with no code an array of urls included in this dictionnary that should be blacklisted to 
  gain productivity. If it's related to social media or spending a lot of time on an entertainment, label it as non-productive. If it is ambiguous and has a abnormal amount of time, 
  label it as non-productive. The output should have a maximum size of 3, have the name "Array" and should strictly have urls that are in the variable "Dictionnary". If you encounter a line with "// Example", you should avoid returning this line as a result. 
  If Dictionnary is "{}", say "No recommendation needed, you are very productive !". Every "Entry / Output" lines are examples for you to train and should be isolated 
  from the content of Dictionnary. If you are unsure about something, ask me questions. Examples:
Entry : {}
Output : "No recommendation needed, you are very productive !" // Example
Entry : {youtube.com: 567, linkedin.com: 6000: google.com: 500}
Output : [youtube.com, linkedin.com] // Example
Entry : {tiktok.com: 60, origami.com: 45, outlook.com: 780}
Output : [tiktok.com, origami.com] // Example
Entry : {minecraft.com: 500, gmail.com: 70}
Output : [minecraft.com] // Example

Dictionnary :  ${urlsTimestamp}
Array :`;
  const session = await ai.assistant.create({
    systemPrompt: prompt
  });
  const result = await session.prompt([]);
  console.log("Result of the prompt : ", result);
  session.destroy();
}


/* function cleanDebug() {
  chrome.storage.local.set({ urls: [] });
} */
