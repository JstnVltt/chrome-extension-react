import React from 'react';

const Button = (props) => {
  const { id, functionURL, children } = props;
  return (
    <button id={id} onclick={async()=> { 
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) { console.error("Error in button : can't retreive tab."); return; };
      
      functionURL = () => functionURL(tab.url);
      {functionURL}; printBlacklist(); }}>{children}</button>
  );
};

export default Button;
