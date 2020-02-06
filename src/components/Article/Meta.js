import React from 'react';
import { Link } from 'react-router-dom';
import { Bind, withBindings } from 'statium';

import Userpic from '../Userpic.js';
import FavIcon from './FavIcon.js';

const Meta = ({ authorUsername, authorImage, createdAt, canModify }) => (
    <div className="article-meta">
        <Link to={`/@${authorUsername}`}>
            <Userpic src={authorImage} alt={authorUsername} />
        </Link>
    
        <div className="info">
            <Link to={`/@${authorUsername}`} className="author">
                {authorUsername}
            </Link>
            
            <span className="date">
                {new Date(createdAt).toDateString()}
            </span>
        </div>
        
        <Actions canModify={canModify} />
    </div>
);

export default withBindings({
    canModify: 'canModify',
    authorUsername: 'article.author.username',
    authorImage: 'article.author.image',
    createdAt: 'article.createdAt',
})(Meta);

const Actions = ({ canModify }) => (
    <Bind controller props={{
            slug: 'article.slug',
            favorited: 'article.favorited',
            favoritesCount: 'article.favoritesCount',
        }}>
        { ({ slug, ...rest }, { $dispatch }) => (
            <span>
                <FavIcon slug={slug} {...rest} />
                
                { canModify && (
                    <>
                        &nbsp;
                
                        <Link to={`/editor/${slug}`}
                            className="btn btn-outline-secondary btn-sm">
                    
                            <i className="ion-edit" />&nbsp;Edit Article
                        </Link>
                
                        &nbsp;
                
                        <button className="btn btn-outline-danger btn-sm"
                            onClick={() => { $dispatch('deleteArticle', slug); }}>
                    
                            <i className="ion-trash-a" />&nbsp;Delete Article
                        </button>
                    </>
                )}
            </span>
        )}
    </Bind>
);
