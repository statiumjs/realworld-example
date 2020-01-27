import React from 'react';
import { withBindings } from 'statium';
import { Link } from 'react-router-dom';

import Userpic from '../Userpic.js';
import TagList from './TagList.js';
import FavIcon from './FavIcon.js';

const ArticlePreview = props => (
    <div className="article-preview">
        <div className="article-meta">
            <Link to={`/@${props.authorUsername}`}>
                <Userpic src={props.authorPic} alt={props.authorUsername} />
            </Link>

            <div className="info">
                <Link className="author" to={`/@${props.authorUsername}`}>
                    {props.authorUsername}
                </Link>
    
                <span className="date">
                    {new Date(props.createdAt).toDateString()}
                </span>
            </div>

            <div className="pull-xs-right">
                <FavIcon {...props} />
            </div>
        </div>

        <Link to={`/article/${props.slug}`} className="preview-link">
            <h1>
                {props.title}
            </h1>

            <p>
                {props.description}
            </p>

            <span>
                Read more...
            </span>

            <TagList tagList={props.tagList} />
        </Link>
    </div>
);

export default withBindings({
    title: 'article.title',
    description: 'article.description',
    slug: 'article.slug',
    tagList: 'article.tagList',
    authorUsername: 'article.author.username',
    authorImage: 'article.author.image',
    createdAt: 'article.createdAt',
    favorited: 'article.favorited',
    favoritesCount: 'article.favoritesCount',
})(ArticlePreview);
