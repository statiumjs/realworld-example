import React from 'react';
import ViewModel, { Bind, withBindings } from 'statium';

import LoadMask from '../LoadMask.js';

import Banner from './Banner.js';
import FeedView from './Feed.js';
import TagView from './Tags.js';

const initialState = {
    tab: 'global',
    page: 0,
    limit: 10,
    articles: null,
    articlesCount: 0,
    tags: null,
    selectedTag: null,
    loading: false,
};

const loadArticles = async ({ $get, $set }, props) => {
    if ($get('loading')) {
        return;
    }
    
    if (props && props.tab) {
        await $set('tab', props.tab);
    }
    
    const [api, tab, page, limit, selectedTag] =
        $get('api', 'tab', 'page', 'limit', 'selectedTag');
    
    await $set('loading', true);
    
    const feedFn = tab === 'feed' ? api.Articles.feed : api.Articles.all;
    
    const { articles = [], articlesCount = 0 }
        = selectedTag
        ? await api.Articles.byTag(selectedTag, page, limit)
        : await feedFn(page, limit);
    
    // N.B. Loading tags every time is probably not required, but it's a demo...
    const { tags } = await api.Tags.all();
    
    $set({
        loading: false,
        articles,
        articlesCount,
        tags,
    });
};

const wrapSetter = name => async ({ $set, $dispatch }, arg) => {
    await $set(name, arg);
    
    $dispatch('loadArticles');
};

const setTab = async ({ $get, $set, $dispatch }, tab) => {
    await $set({
        tab,
        selectedTag: null,
    });
    
    const newPath = tab === 'feed' ? '/feed' : '/';
    
    const history = $get('history');
    history.push(newPath);
    
    $dispatch('loadArticles');
};

const Home = ({ appName, ...props }) => (
    <ViewModel id="Home"
        initialState={initialState}
        protectedKeys={["tab", "page", "limit", "selectedTag"]}
        controller={{
            initialize: vc => loadArticles(vc, props),
            handlers: {
                loadArticles: loadArticles,
                setPage: wrapSetter('page'),
                setLimit: wrapSetter('limit'),
                setTab,
                setSelectedTag: async ({ $set, $dispatch }, selectedTag) => {
                    await $set({
                        selectedTag,
                        tab: 'tagFilter',
                    });
                    
                    $dispatch('loadArticles');
                },
            },
        }}>
        <div className="home-page">
            <Banner appName={appName} />
            
            <Bind props="loading">
                { ({ loading }) => (
                    <div className="container page" style={{ position: 'relative' }}>
                        <LoadMask loading={loading} />
                        
                        <div className="row">
                            <FeedView />
                            
                            <div className="col-md-3">
                                <div className="sidebar">
                                    <p>Popular Tags</p>
                                    
                                    <TagView />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Bind>
        </div>
    </ViewModel>
);


export default withBindings('appName')(Home);
