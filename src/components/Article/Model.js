import React from 'react';
import ViewModel from 'statium';

const canModify = $get => {
    const currentUser = $get('user.username');
    const articleUser = $get('article.author.username');
    
    return currentUser && articleUser && currentUser === articleUser;
};

const doFavors = async (type, { $get, $set }, slug) => {
    const api = $get('api');
    
    try {
        const { favorited, favoritesCount } = await api.Articles[type](slug);
        const article = $get('article');
        
        await $set({
            article: {
                ...article,
                favorited,
                favoritesCount,
            },
        });
    }
    catch (e) {
        // No-op for now
    }
};

const favorite = (...args) => doFavors('favorite', ...args);
const unfavorite = (...args) => doFavors('unfavorite', ...args);

const ArticleModel = ({ article, children, ...props }) => {
    const controller = props.controller || {};
    const handlers = controller.handlers;
    
    controller.handlers = {
        ...handlers,
        favorite,
        unfavorite,
    };
    
    return (
        <ViewModel initialState={{ article }}
            formulas={{
                canModify,
            }}
            controller={controller}
            {...props}>
            { children }
        </ViewModel>
    );
};

export default ArticleModel;
