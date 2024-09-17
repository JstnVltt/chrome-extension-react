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
  const prompt = `you are in charge of evaluating if the urls i'm giving you are productive platform (work friendly) or improductive. 
If the website has potential of time drain, is a social media or has too much time associated, it should be blacklisted. 
I will give you an entry and depending on the content of this entry, your answer has to be different. : 
if the array is like '{"url": time}', give me an array of objects like that :   
[{url:'http://example.com',isProductive:true'},{url:'http://example2.com',isProductive:false'}] depending on the time 
associated with each url and on the url. 
If the entry is '{}', give me directly the following string : "no urls to recommend". I want you to give me directly the answer, like you would give it to a friend, not in terms of code.

Entry : {
  "https://chrome.dev/web-ai-demos/prompt-api-playground/": 4.835,
  "https://www.linkedin.com/": 92.984,
  "https://stackoverflow.com/": 181.903,
  "https://www.gmail.com/": 1.178,
  "https://www.tiktok.com/": 186.333
}
Output :`;

  console.log("AI loading answer, please wait...");
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
