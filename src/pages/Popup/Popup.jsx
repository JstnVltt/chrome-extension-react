import React from 'react';
import logo from '../../assets/img/logo.svg';
import {addUrl, removeURL, printBlacklist} from './Popup.js';
import Button from './Button.jsx';

const Popup = () => {
  return (
    <div className="App">
      <template id="li_template">
      <li>
        <a>
          <h3 class="title">Tab Title</h3>
          <p class="pathname">Tab Pathname</p>
        </a>
      </li>
      </template>

      <h1>Blacklister</h1>

      <Button id="blacklist" functionURL={addUrl} >Blacklist this website</Button>
      <Button id = "remove blacklist" functionURL={removeURL}>Remove this website from blacklist</Button>
      <ul></ul>

      <script src="./popupJs.bundle.js" type="module"></script>
    </div>
  );
};

export default Popup;
