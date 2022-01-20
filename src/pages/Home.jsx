import React from 'react';
import Store, { useStore } from 'statium';
import { useParams } from 'react-router';

import LoadMask from '../components/LoadMask.jsx';
import Tab from '../components/Tab.jsx'

import Banner from '../components/Home/Banner.jsx';
import FeedView from '../components/Article/Feed.jsx';
import Tags from '../components/Home/Tags.jsx';

import { setTab } from '../actions/article.js';

const defaultLimit = 10;

// Article feeds can display arbitrary number of articles
const articleLimitOptions = [
  { value: 10 },
  { value: 25 },
  { value: 50 },
  { value: 100 },
  { value: Infinity, text: "All" },
];

const initialState = {
  busy: false,
  show: true,
};

const Home = ({ tab }) => {
  const { selectedTag } = useParams();
  const { state } = useStore();

  const tabs = (
    <>
      {state.user &&
        <Tab id="feed" to="/feed" name="Your Feed" currentTab={tab} setTab={setTab} />
      }

      <Tab id="global" to="/" name="Global Feed" currentTab={tab} setTab={setTab} />

      {selectedTag &&
        <Tab id="tag"
          to={`/tag/${selectedTag}`}
          name={`# ${selectedTag}`}
          currentTab={tab}
          setTab={setTab}
        />
      }
    </>
  );

  return (
    <Store tag="Home"
      data={{
        tab,
        selectedTag,
        defaultLimit,
        articleLimitOptions,
      }}
      initialState={initialState}
    >
    {({ state: { user, busy } }) => (
      <div className="home-page">
        {!user && <Banner />}

        <div className="container page">
          <LoadMask loading={busy} />

          <div className="row">
            <div className="col-md-9">
              <FeedView tabs={tabs} />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <Tags />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </Store>
  );
}

export default Home;
