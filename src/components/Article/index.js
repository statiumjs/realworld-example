import React from 'react';
import { Bind, withBindings } from 'statium';
import marked from 'marked';
import { sanitize } from 'dompurify';

import Model from './Model.js';
import Meta from './Meta.js';
import TagList from './TagList.js';
import Comments from './Comments.js';

import LoadMask from '../LoadMask.js';

const ErrorView = ({ error }) => (
    <div>{error}</div>
);

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

const loadArticle = async ({ $get, $set }, { article, match }) => {
    let error;
    
    if (!article) {
        try {
            const { slug } = match.params;
            const api = $get('api');
            
            article = await api.Articles.bySlug(slug);
            article.comments = await api.Articles.getComments(slug);
        }
        catch (e) {
            article = null;
            error = e;
        }
    }
    
    await $set({
        article,
        error,
        loading: false,
    });
};

const deleteArticle = async ({ $get, $set }, { history }) => {
    const [api, slug] = $get('api', 'article.slug');
    
    await $set('loading', true);
    
    try {
        // If no error is thrown, request was successful.
        await api.Articles.delete(slug);
        
        history.push('/');
    }
    catch (e) {
        await $set({
            error: e.toString(),
            loading: false,
        });
    }
};

const postComment = async ({ $get, $set }, { slug, comment }) => {
    const api = $get('api');
    
    try {
        await api.Articles.postComment(slug, comment);
        
        const article = $get('article');
        article.comments = await api.Articles.getComments(slug);
        
        $set('article', article);
    }
    catch (e) {
        $set('error', e.toString());
    }
};

const deleteComment = async ({ $get, $set }, { slug, commentId }) => {
    const api = $get('api');
    
    try {
        await api.Articles.deleteComment(slug, commentId);
        
        const article = $get('article');
        article.comments = await api.Articles.getComments(slug);
        
        $set('article', article);
    }
    catch (e) {
        $set('error', e.toString());
    }
};

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
