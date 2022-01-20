import React from 'react';
import { useStore } from 'statium';
import { Link } from 'react-router-dom';

import Userpic from '../Userpic.jsx';
import Tags from './Tags.jsx';
import FavIcon from './FavIcon.jsx';

const ArticleStub = () => {
  const { state: { article } } = useStore();

  const { title, description, slug, tagList, createdAt } = article;
  const authorUser = article?.author?.username;
  const authorPic = article.author?.image;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/@${authorUser}`}>
          <Userpic src={authorPic} alt={authorUser} />
        </Link>

        <div className="info">
          <Link className="author" to={`/@${authorUser}`}>
            {authorUser}
          </Link>

          <span className="date">
            {new Date(createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <FavIcon slug={slug} />
        </div>
      </div>

      <Link to={`/article/${slug}`} className="preview-link">
        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

        <span>
          Read more...
        </span>

        <Tags tags={tagList} component="li" />
      </Link>
    </div>
  );
};

export default ArticleStub;
