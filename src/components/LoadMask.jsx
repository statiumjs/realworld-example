import React from 'react';

import './LoadMask.css';

const LoadMask = ({ loading, size = '50px' }) => (
  <div className={`load-mask ${!loading ? 'hidden' : ''}`}>
    <div className="load-mask-inner">
      <i className="ion ion-load-c load-spinner"
        style={{ fontSize: size }} />
    </div>
  </div>
);

export default LoadMask;
