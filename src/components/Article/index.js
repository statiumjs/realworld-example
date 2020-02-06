import React from 'react';
import { Bind, withBindings } from 'statium';
import marked from 'marked';
import { sanitize } from 'dompurify';

import Model from './Model.js';
import Meta from './Meta.js';
import TagList from './TagList.js';
import Comments from './Comments.js';

import LoadMask from '../LoadMask.js';

import { loadArticle, deleteArticle, postComment, deleteComment } from './handlers.js';

const defaultState = {
    loading: true,
    article: null,
    error: null,
};

const ArticlePage = props => (
    <Model id="ArticleView" initialState={defaultState}
        controller={{
            initialize: vc => loadArticle(vc, props),
            handlers: {
                deleteArticle: vc => deleteArticle(vc, props),
                postComment,
                deleteComment,
            },
        }}>
        <Bind props={["loading", "article", "error"]}>
            { ({ loading, article, error }) => (
                <>
                    <LoadMask loading={loading} />
                
                    { article && <ArticleView article={article} /> }
                    
                    { error && <ErrorView error={error} /> }
                </>
            )}
        </Bind>
    </Model>
);

export default ArticlePage;

const ArticleViewBase = ({ title, body, tagList }) => (
    <div className="article-page">
        <div className="banner">
            <div className="container">
                <h1>{title}</h1>
                
                <Meta />
            </div>
        </div>
        
        <div className="container page">
            <div className="col-xs-12">
                <div dangerouslySetInnerHTML={{ __html: sanitize(marked(body)) }} />
                
                <TagList tagList={tagList} />
            </div>
        </div>
        
        <div className="row">
            <Comments />
        </div>
    </div>
);

const ArticleView = withBindings({
    canModify: 'canModify',
    article: 'article',
    title: 'article.title',
    body: 'article.body',
    tagList: 'article.tagList',
})(ArticleViewBase);

const ErrorView = ({ error }) => (
    <div>{error}</div>
);
