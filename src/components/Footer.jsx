import React from 'react';

import { appName } from '../misc/constants.js';

const Footer = () => (
  <footer>
    <div className="container">
      <a href="/" className="logo-font">{appName.toLowerCase()}</a>
      <span className="attribution">
        An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
      </span>
    </div>
  </footer>
);

export default Footer;