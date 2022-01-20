import React from 'react';
import { useStore } from 'statium';
import { Link } from 'react-router-dom';

const Tab = ({ id, name, to, currentTab, setTab }) => {
  const { dispatch } = useStore();

  const cls = `nav-link ${id === currentTab ? 'active' : ''}`;

  return (
    <li className="nav-item">
      <Link to="" className={cls} onClick={() => dispatch(setTab, to)}>
        {name}
      </Link>
    </li>
  );
}

export default Tab;
