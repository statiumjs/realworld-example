import React from 'react';
import { useStore } from 'statium';
import { Link } from 'react-router-dom';

const Cell = ({ page, selectedPage, set }) => (
  <li className={`page-item ${page === selectedPage ? 'active' : ''}`}>
    <Link to="" className="page-link" onClick={() => set({ page })}>
      {/* This is correct: we display page numbers with base 1! */}
      {page + 1}
    </Link>
  </li>
);

const Pager = () => {
  const { state, set } = useStore();

  const { articlesCount, page, limit } = state;

  if (articlesCount <= limit) {
    return null;
  }

  const pages = [...Array(Math.ceil(articlesCount / limit))].map((_, idx) => idx);

  return (
    <nav>
      <ul className="pagination">
        {pages.map(idx =>
          <Cell key={idx} page={idx} selectedPage={page} set={set} />)}
      </ul>
    </nav>
  );
};

export default Pager;
