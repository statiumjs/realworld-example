import React from 'react';
import Store, { useStore } from 'statium';

import ArticleStub from './Stub.jsx';
import Pager from './Pager.jsx';

const ArticleStubList = () => {
  const { state: { articles } } = useStore();

  if (!articles) {
    return (
      <div className="article-preview">
        Loading...
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="article-preview">
        There are no articles to view... yet.
      </div>
    );
  }

  return (
    <>
      {articles.map(article =>
        <Store key={article.slug} tag={`Article-${article.slug}`} initialState={{ article }}>
          <ArticleStub />
        </Store>
      )}

      <Pager />
    </>
  );
};

export default ArticleStubList;