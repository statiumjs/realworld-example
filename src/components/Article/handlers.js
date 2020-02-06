export const loadArticle = async ({ $get, $set }, { article, match }) => {
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

export const deleteArticle = async ({ $get, $set }, { history }) => {
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

export const postComment = async ({ $get, $set }, { slug, comment }) => {
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

export const deleteComment = async ({ $get, $set }, { slug, commentId }) => {
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
