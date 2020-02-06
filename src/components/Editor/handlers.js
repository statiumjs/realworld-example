const emptyArticle = {
    title: '',
    description: '',
    body: '',
    tagList: [],
};

export const loadArticle = async ({ $get, $set }, { match }) => {
    const { slug } = match.params;
    
    if (slug) {
        try {
            const api = $get('api');
            
            await $set('loading', true);
        
            const article = await api.Articles.get(slug);
            
            await $set({
                slug,
                article,
                error: null,
                loading: false,
            });
        }
        catch (e) {
            await $set({
                error: e.toString(),
                loading: false,
            });
        }
    }
    else {
        $set({
            article: emptyArticle,
            loading: false,
        });
    }
};

export const postArticle = async ({ $get, $set }, article) => {
    const api = $get('api');
    let slug = $get('slug');
    const apiFn = slug ? api.Articles.update : api.Articles.create;
    
    await $set('loading', true);
    
    try {
        const updated = await apiFn(slug, article);
        slug = updated.slug;
        delete updated.slug;
        
        await $set({
            slug,
            article: updated,
        });
    }
    catch (e) {
        await $set('error', e.toString());
    }
    
    await $set('loading', false);
};
