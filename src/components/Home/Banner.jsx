import React from 'react';

import { appName } from '../../misc/constants.js';

const Banner = () => (
  <div className="banner">
    <div className="container">
      <h1 className="logo-font">
        {appName.toLowerCase()}
      </h1>

      <p>
        A place to share your knowledge.
      </p>
    </div>
  </div>
);

export default Banner;
