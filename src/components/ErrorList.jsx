import React from 'react';

const ErrorList = ({ errors }) => (
  <ul className="error-messages">
    {Object.keys(errors).map(err => errors[err] && (
      <li key={err}>
        {err ? `${err}: ` : ''}{errors[err]}
      </li>
    ))}
  </ul>
);

export default ErrorList;
