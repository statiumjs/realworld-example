import React, { useEffect } from 'react';
import Store, { useStore } from 'statium';
import { Link, useParams } from 'react-router-dom';

import Tab from '../components/Tab.jsx';
import LoadMask from '../components/LoadMask.jsx';
import Userpic from '../components/Userpic.jsx';
import FeedView from '../components/Article/Feed.jsx';
import FollowButton from '../components/FollowButton.jsx';

import { loadProfile, follow, unfollow } from '../actions/profile.js';
import { setTab } from '../actions/article.js';

const defaultLimit = 5;

// We don't allow displaying more than 15 article stubs on the Profile page.
// This is an arbitrary limitation to showcase reusing and dynamically configuring
// the Article/LimitSelect component via Store data.
const limitOptions = [
  { value: 5 },
  { value: 10 },
  { value: 15 },
];

const initialState = {
  busy: false,
  profile: null,
};

const Profile = ({ tab }) => {
  const { username } = useParams();

  return (
    <Store tag="Profile"
      data={{
        username,
        tab,
        defaultLimit,
        articleLimitOptions: limitOptions,
      }}
      initialState={initialState}
    >
    {( { state: { busy } }) => (
      <div className="profile-page">
        <LoadMask loading={busy} />

        <ProfileView />
      </div>
    )}
    </Store>
  );
};

const ProfileView = () => {
  const { data, state, dispatch } = useStore();

  const { tab, username } = data;
  const { busy, profile, user } = state;
  const { image, bio, following } = profile || {};
  const isCurrentUser = username === user?.username;

  useEffect(() => {
    dispatch(loadProfile, username);
  }, [username, dispatch]);

  if (!profile) {
    return null;
  }

  const tabs = (
    <>
      <Tab id="authored"
          to={`/@${username}`}
          name={isCurrentUser ? "My Articles" : `${username}'s Articles`}
          currentTab={tab}
          setTab={setTab} />
      
      {isCurrentUser && <Tab id="favorites"
        to={`/@${username}/favorites`}
        name="Favorited Articles"
        currentTab={tab}
        setTab={setTab} />
      }
    </>
  );

  return (
    <>
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Userpic className="user-img" src={image} alt={username} />

              <h4>
                <Link to={`/@${username}`}>{username}</Link>
              </h4>
              <p>{bio}</p>

              {!busy && username === profile.username && isCurrentUser &&
                <Link to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a" />
                  &nbsp;
                  Edit Profile Settings
                </Link>
              }

              {!busy && user && !isCurrentUser &&
                <FollowButton username={username}
                  following={following}
                  follow={follow}
                  unfollow={unfollow} />
              }
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <FeedView tabs={tabs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
