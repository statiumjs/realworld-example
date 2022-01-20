import React from 'react';

// Back end API is inconsistent: for GET /user it returns
// image: null but for GET /profiles/username it returns
// image: <default image>. Articles are also returned with
// null image if missing.
// Use default image URL for consistency.
const defaultImage = "https://static.productionready.io/images/smiley-cyrus.jpg";

const Userpic = ({ src, alt, ...props }) =>
  <img src={src || defaultImage} alt={alt || ""} {...props} />

export default Userpic;
