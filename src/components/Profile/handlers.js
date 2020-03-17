export const initialize = async ({ $get, $set, $dispatch }, tab) => {
    if (tab) {
        await $set('tab', tab);
    }

    await loadProfile({ $get, $set, $dispatch });
};

export const loadProfile = async ({ $get, $set, $dispatch }) => {
    // Initial state has loading: true so we don't need to set it
    const [api, username] = $get('api', 'username');
    const profile = await api.Profile.get(username);
    
    await $set('profile', profile);
    
    await loadArticles({ $get, $set });
    
    await $set('loading', false);
};

export const loadArticles = async ({ $get, $set }) => {
    const [api, tab, username, page, limit] =
        $get('api', 'tab', 'username', 'page', 'limit');
    
    const apiFn = tab === 'authored' ? api.Articles.byAuthor : api.Articles.favoritedBy;
    
    await $set('loadingArticles', true);
    
    const { articles, articlesCount } = await apiFn(username, page, limit);
    
    await $set({
        articles,
        articlesCount,
        loadingArticles: false,
    });
};

export const setTab = async ({ $get, $set, $dispatch }, tab) => {
    const [history, username] = $get('history', 'username');
    const newPathname = tab === 'authored' ? `/@${username}` : `/@${username}/favorites`;
    
    history.push(newPathname);
    await $set('tab', tab);
    $dispatch('loadArticles');
};

export const setPage = async ({ $set, $dispatch }, page) => {
    await $set('page', page);
    $dispatch('loadArticles');
};

export const setLimit = async ({ $set, $dispatch }, limit) => {
    await $set('limit', limit);
    $dispatch('loadArticles');
};

export const follow = async ({ $get, $set }, username) => {
    const api = $get('api');
    
    await $set('disableFollowButton', true);
    
    const profile = await api.Profile.follow(username);
    
    await $set({
        profile,
        disableFollowButton: false,
    });
};

export const unfollow = async ({ $get, $set }, username) => {
    const api = $get('api');
    
    await $set('disableFollowButton', true);
    
    const profile = await api.Profile.unfollow(username);
    
    await $set({
        profile,
        disableFollowButton: false,
    });
};
