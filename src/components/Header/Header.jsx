import React from 'react';
import { useStore } from 'statium';
import { Link } from 'react-router-dom';

import NavLink from './NavLink.jsx';

import { appName } from '../../misc/constants.js';

import Userpic from '../Userpic.jsx';

const LoggedOut = () => (
  <ul className="nav navbar-nav pull-xs-right">
    <li className="nav-item">
      <NavLink to="/">
        Home
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/login">
        Sign in
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/register">
        Sign up
      </NavLink>
    </li>
  </ul>
);

const LoggedIn = ({ user }) => (
  <ul className="nav navbar-nav pull-xs-right">
    <li className="nav-item">
      <NavLink to="/">
        Home
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/editor">
        <i className="ion-compose" />&nbsp;New Article
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/settings">
        <i className="ion-gear-a" />&nbsp;Settings
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to={`/@${user.username}`}>
        <Userpic src={user.image}
          className="user-pic"
          alt={user.username} />
        <span>
          &nbsp;
          {user.username}
        </span>
      </NavLink>
    </li>
  </ul>
);

export const Header = () => {
  const { state: { user } } = useStore();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          {appName.toLowerCase()}
        </Link>
        {user ? <LoggedIn user={user} /> : <LoggedOut />}
      </div>
    </nav>
  );
}

export default Header;
