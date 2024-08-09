import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

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
      <button id="blacklist">Blacklist this website</button>
      <button id="remove blacklist">Remove this website from blacklist</button>
      <ul></ul>

      <script src="./popupJs.bundle.js" type="module"></script>
    </div>
  );
};

export default Popup;
