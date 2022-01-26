import React, { useEffect } from 'react';
import Store, { useStore } from 'statium';
import stateToUri from 'urlito';

import ArticleStubList from './StubList.jsx';
import ArticleLimitSelect from './LimitSelect.jsx';

import API from '../../api.js';

const tabBarClassByTab = {
  authored: 'articles-toggle',
  favorites: 'articles-toggle',
  tag: 'feed-toggle',
  feed: 'feed-toggle',
  global: 'feed-toggle',
};

const FeedView = ({ tabs }) => {
  const { data, state, dispatch } = useStore();

  const { tab, selectedTag, username, defaultLimit } = data;
  const { user, page, limit, articles, articlesCount } = state;

  useEffect(() => {
    dispatch(loadArticles, { tab, selectedTag, username, page, limit });
  }, [user, tab, selectedTag, username, page, limit, dispatch]);

  return (
    <>
      <div className={tabBarClassByTab[tab] || 'feed-toggle'}>
        <ul className="nav nav-pills outline-active">
          {tabs}
          {articlesCount > defaultLimit && <ArticleLimitSelect />}
        </ul>
      </div>

      <ArticleStubList articles={articles} />
    </>
  );
};

const Feed = ({ tabs }) => {
  const { data: { defaultLimit } } = useStore();

  const initialState = {
    page: 0,
    limit: defaultLimit,
    articles: null,
    articlesCount: 0,
  };
  
  const [getStateFromUri, setStateToUri] = stateToUri(initialState, {
    page: {
      fromUri: value => parseInt(value, 10),
      toUri: value => String(value),
    },
    limit: {
      fromUri: value => parseInt(value, 10),
      toUri: value => String(value),
    },
  });
  
  return (
    <Store tag="Feed view" initialState={getStateFromUri} onStateChange={setStateToUri}>
      <FeedView tabs={tabs} />
    </Store>
  );
};

export const loadArticles = async ({ state, set }, params) => {
  if (state.busy) {
    return;
  }

  const { page, tab, selectedTag, username } = params;

  // We'd like to have an option to display _all_ articles available
  // for a given feed (just for the kicks!), and the UI uses Infinity value
  // for that. The back end doesn't accept this value so we replace it
  // with arbitrarily high value here :)
  const limit = Math.min(params.limit || 0, 100000);

  await set({ busy: true });

  let response;

  if (selectedTag) {
    response = await API.Articles.byTag(selectedTag, page, limit);
  }
  else if (tab === 'feed') {
    response = await API.Articles.feed(page, limit);
  }
  else if (tab === 'authored') {
    response = await API.Articles.byAuthor(username, page, limit);
  }
  else if (tab === 'favorites') {
    response = await API.Articles.favoritedBy(username, page, limit);
  }
  else {
    response = await API.Articles.all(page, limit);
  }

  const { articles = [], articlesCount = 0 } = response;

  await set({
    articles,
    articlesCount,
    busy: false,
  });
};

export default Feed;
