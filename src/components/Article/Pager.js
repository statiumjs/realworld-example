import React from 'react';
import { Link } from 'react-router-dom';

const Pager = ({ articlesCount, limit, ...props }) => {
    if (articlesCount <= limit) {
        return null;
    }
    
    const pages = [...Array(Math.ceil(articlesCount / limit))].map((_, idx) => idx);

    return (
        <nav>
            <ul className="pagination">
                {pages.map(page => <Cell key={page} value={page} {...props} />)}
            </ul>
        </nav>
    );
};

export default Pager;

const Cell = ({ value, page, setPage }) => (
    <li className={`page-item ${value === page ? 'active' : ''}`}>
        <Link to="" className="page-link"
            onClick={e => {
                e.preventDefault();
                setPage(value);
            }}>
            
            {value + 1}
        </Link>
    </li>
);
