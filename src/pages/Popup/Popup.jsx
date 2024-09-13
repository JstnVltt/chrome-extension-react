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
  const prompt = `I give you an entry with urls and time spent on them in seconds. Answer with no code with these instructions :
i want you to give me an array of urls that are present in the real entry that are not productive for work. These criterias
make an url not productve : time consuming, entertainment, high dopamine.
On contrary, these criterias make urls productive and therefore not shown on the output : exchanging by emails, 
coding related, research related, office, productivity, communicating with co-workers, giving knowledge or facts. Don't give me an explaination.
Examples :
Example 1 :
Entry : {tiktok.com:6666, google.com:20}
Output : [tiktok.com]
Explaination : tiktok is a social media that drains time and is not productive.

Example 2 :
Entry : {origami.com: 50, gmail.com: 7777, youtube.com: 500}
Output : [youtube.com]
explaination : origami.com is not related to work but has low time spent compared to other urls. Youtube has a high time and is not linked to work, so not productive. gmail has a really high time spent but is used to work with co-workers and is productive.

Example 3 :
Entry : {gmail.com: 6000, google.com: 5000, outlook.com: 7000}
Output : []
explaination : all the urls are considered as productive because they are used to search (google.com) or to communicate with others (gmail.com, outlook.com).

Example 4 :
Entry : {instagram.com.com: 8888, gmail.com: 50000, outlook: 500, linkedin.com: 6000}
Output : [instagram.com, linkedin.com]
Explaination : instagram is a social media with potential of time retention and is not linked to work so does'nt contribute
to being productive. Even though linkedin can be seen as productive, the amount of time is too high to considere it being
productive. outlook and gmail are both websites that contribute in being productive byy the mean of sending emails to 
co-workers


Real entry : ${urlsTimestamp}
Output : `;

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
