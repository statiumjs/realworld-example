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

const Home = ({ appName, tab, selectedTag }) => (
    <ViewModel id="Home"
        initialState={{
            ...initialState,
            ...tab != null ? { tab } : {},
            ...selectedTag != null ? { selectedTag } : {},
        }}
        protectedKeys={["tab", "page", "limit", "selectedTag"]}
        controller={{
            initialize: loadArticles,
            handlers: {
                loadArticles,
                setPage: wrapSetter('page'),
                setLimit: wrapSetter('limit'),
                setTab,
                setSelectedTag,
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

const loadArticles = async ({ $get, $set }) => {
    if ($get('loading')) {
        return;
    }
    
    const [api, tab, page, limit, selectedTag] =
        $get('api', 'tab', 'page', 'limit', 'selectedTag');
    
    await $set('loading', true);
    
    const { articles = [], articlesCount = 0 }
        = selectedTag    ? await api.Articles.byTag(selectedTag, page, limit)
        : tab === 'feed' ? await api.Articles.feed(page, limit)
        :                  await api.Articles.all(page, limit)
        ;
    
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

const setSelectedTag = async ({ $set, $dispatch }, selectedTag) =>
    // Setting the tab will load the articles, see setTab
    $set({
        selectedTag,
        tab: 'tagFilter',
    });

const setTab = async ({ $get, $set, $dispatch }, tab) => {
    await $set({
        tab,
        ...tab === 'tagFilter' ? {} : { selectedTag: null },
    });
    
    const newPath = tab === 'feed'      ? '/feed'
                  : tab === 'tagFilter' ? `/tag/${$get('selectedTag')}`
                  :                       '/'
                  ;
    
    const history = $get('history');
    history.push(newPath);
    
    $dispatch('loadArticles');
};
