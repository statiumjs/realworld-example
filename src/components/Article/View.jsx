import React, { useEffect } from 'react';
import { useStore } from 'statium';

import Markdown from 'markdown-to-jsx';

import Meta from './Meta.jsx';
import Tags from './Tags.jsx';
import Comments from './Comments/Comments.jsx';

import { loadArticle } from '../../actions/article.js';

const ArticleView = () => {
  const { data, state, dispatch } = useStore();
  const { article } = state;
  const { slug } = data;

  // We don't _really_ need to include dispatch function in the list of dependencies
  // for useEffect hook since the function identity is stable and will not ever change.
  // ESLint rules for hooks are not aware of that though, and will complain about
  // missing dependency.
  useEffect(() => {
    dispatch(loadArticle, { slug, loadComments: true, loadProfile: true });
  }, [slug, dispatch]);

  if (!article) {
    return null;
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <Meta />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <Markdown>
              {article.body}
            </Markdown>
          </div>
        </div>

        <Tags tags={article.tagList} />

        <hr />

        <div className="article-actions">
          {/* Yes article-meta is repeated here, see 
              https://gothinkster.github.io/realworld/docs/specs/frontend-specs/templates */}
          <Meta />
        </div>

        <div className="row">
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
