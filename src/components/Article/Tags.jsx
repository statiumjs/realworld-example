import React from 'react';
import { Link } from 'react-router-dom';

const Tags = ({ tags = [], component = Link }) => (
  <ul className="tag-list">
    {tags.map(tag => React.createElement(component, {
        key: tag,
        className: "tag-default tag-pill tag-outline",
        ...component === Link ? { to: `/tag/${tag}` } : {},
    }, tag))}
  </ul>
);

export default Tags;
