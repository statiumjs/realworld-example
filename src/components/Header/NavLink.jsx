import React from 'react';
import { NavLink as BaseNavLink } from 'react-router-dom';

const NavLink = props =>
  <BaseNavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
    {...props} />;

export default NavLink;
