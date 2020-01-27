import React from 'react';
import { Link } from 'react-router-dom';

const Tab = ({ id, name, tab, setTab }) => (
    <li className="nav-item">
        <Link to="" className={`nav-link ${tab === id ? 'active' : ''}`}
            onClick={e => {
                e.preventDefault();
                setTab && setTab(id);
            }}>
            {name}
        </Link>
    </li>
);

export default Tab;
