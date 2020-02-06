export const initialize = async ({ $get, $set, $dispatch }, tab) => {
    try {
        if (tab) {
            await $set('tab', tab);
        }

        await loadProfile({ $get, $set, $dispatch });
    }
    catch (e) {
    }
};

export const loadProfile = async ({ $get, $set, $dispatch }) => {
    try {
        // Initial state has loading: true so we don't need to set it
        const [api, username] = $get('api', 'username');
        const profile = await api.Profile.get(username);
        
        await $set('profile', profile);
        
        await loadArticles({ $get, $set });
        
        await $set('loading', false);
    }
    catch (e) {
        // No-op for now
    }
};

export const loadArticles = async ({ $get, $set }) => {
    try {
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
    }
    catch (e) {
        // No-op for now
    }
};

export const setTab = async ({ $get, $set, $dispatch }, tab) => {
    try {
        const [history, username] = $get('history', 'username');
        const newPathname = tab === 'authored' ? `/@${username}` : `/@${username}/favorites`;
        
        history.push(newPathname);
        await $set('tab', tab);
        $dispatch('loadArticles');
    }
    catch (e) {
        // No-op for now
    }
};

export const setPage = async ({ $set, $dispatch }, page) => {
    try {
        await $set('page', page);
        $dispatch('loadArticles');
    }
    catch (e) {
        // No-op for now
    }
};

export const setLimit = async ({ $set, $dispatch }, limit) => {
    try {
        await $set('limit', limit);
        $dispatch('loadArticles');
    }
    catch (e) {
        // No-op for now
    }
};

export const follow = async ({ $get, $set }, username) => {
    try {
        const api = $get('api');
        
        await $set('disableFollowButton', true);
        
        const profile = await api.Profile.follow(username);
        
        await $set({
            profile,
            disableFollowButton: false,
        });
    }
    catch (e) {
        // No-op for now
    }
};

export const unfollow = async ({ $get, $set }, username) => {
    try {
        const api = $get('api');
        
        await $set('disableFollowButton', true);
        
        const profile = await api.Profile.unfollow(username);
        
        await $set({
            profile,
            disableFollowButton: false,
        });
    }
    catch (e) {
        // No-op for now
    }
};
