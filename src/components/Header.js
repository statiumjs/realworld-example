import React from 'react';
import { withBindings } from 'statium';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

import Userpic from './Userpic.js';

const LoggedOut = () => (
    <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item">
            <Link to="/" className="nav-link">
                Home
            </Link>
        </li>
        
        <li className="nav-item">
            <Link to="/login" className="nav-link">
                Sign in
            </Link>
        </li>
        
        <li className="nav-item">
            <Link to="/register" className="nav-link">
                Sign up
            </Link>
        </li>
    </ul>
);

const LoggedIn = ({ user }) => (
    <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item">
            <Link to="/" className="nav-link">
                Home
            </Link>
        </li>
        
        <li className="nav-item">
            <Link to="/editor" className="nav-link">
                <i className="ion-compose" />&nbsp;New Post
            </Link>
        </li>
        
        <li className="nav-item">
            <Link to="/settings" className="nav-link">
                <i className="ion-gear-a" />&nbsp;Settings
            </Link>
        </li>
        
        <li className="nav-item">
            <Link to={`/@${user.username}`} className="nav-link">
                <Userpic src={get(user, 'image')}
                    className="user-pic"
                    alt={get(user, 'username')} />
                <span>
                    &nbsp;
                    { get(user, 'username') }
                </span>
            </Link>
        </li>
    </ul>
);

const Header = ({ appName, user }) => (
    <nav className="navbar navbar-light">
        <div className="container">
            <Link to="/" className="navbar-brand">
                {appName.toLowerCase()}
            </Link>
        </div>
        
        { user ? <LoggedIn user={user} /> : <LoggedOut /> }
    </nav>
);

export default withBindings(['appName', 'user'])(Header);
