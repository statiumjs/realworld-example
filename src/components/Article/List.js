import React from 'react';

import Model from './Model.js';
import Preview from './Preview.js';
import Pager from './Pager.js';

const ArticleList = ({ articles, ...props }) => {
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
            {articles.map(article => (
                <Model key={article.slug} article={article}>
                    <Preview />
                </Model>
            ))}
            
            <Pager {...props} />
        </>
    );
};

export default ArticleList;
