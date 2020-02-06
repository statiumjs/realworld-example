import React from 'react';
import ViewModel, { Bind, withBindings } from 'statium';
import { Link } from 'react-router-dom';

import Tab from '../Tab.js';
import LoadMask from '../LoadMask.js';
import Userpic from '../Userpic.js';
import ArticleList from '../Article/List.js';

import {
    initialize,
    loadArticles,
    setTab,
    setPage,
    setLimit,
    follow,
    unfollow,
} from './handlers.js';

const MyArticlesTab = props => (
    <Tab id="authored" name="My Articles" {...props} />
);

const FavoritedArticlesTab = props => (
    <Tab id="favorites" name="Favorited Articles" {...props} />
);

const defaultState = {
    loading: true,
    profile: null,
    loadingArticles: false,
    tab: 'authored',
    page: 0,
    limit: 5,
    articles: null,
    articlesCount: 0,
    disableFollowButton: false,
};

const Profile = ({ match, tab }) => (
    <ViewModel id="Profile"
        data={{ username: match.params.username }}
        initialState={defaultState}
        protectedKeys={["tab", "page", "limit"]}
        controller={{
            initialize: vc => initialize(vc, tab),
            handlers: {
                setTab,
                setPage,
                setLimit,
                loadArticles,
                follow,
                unfollow,
            },
        }}>
        
        <ProfilePage />
    </ViewModel>
);

const FollowButton = ({ username, following }) => (
    <Bind props="disableFollowButton" controller>
        { ({ disableFollowButton }, { $dispatch }) => (
            <button disabled={!!disableFollowButton}
                className={'btn btn-sm action-btn ' +
                           (following ? 'btn-secondary' : 'btn-outline-secondary')}
                style={{ opacity: disableFollowButton ? '0.5' : '1' }}
                onClick={e => {
                    e.preventDefault();
                    $dispatch(following ? 'unfollow' : 'follow', username);
                }}>
                
                <i className="ion-plus-round" />
                &nbsp;
                {following ? "Unfollow" : "Follow"}
                &nbsp;
                {username}
            </button>
        )}
    </Bind>
);

const ProfilePageBase = ({ loading, loadingArticles, tab, setTab, ...props }) => (
    <div className="profile-page">
        <LoadMask loading={loading} />
    
        <div className="user-info">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-md-10 offset-md-1">
                        <Userpic className="user-img"
                            src={props.image}
                            alt={props.username} />
                    
                        <h4>
                            <Link to={`/@${props.username}`}>
                                {props.username}
                            </Link>
                        </h4>
                        <p>{props.bio}</p>
                    
                        { !loading && props.isCurrentUser &&
                            <Link to="/settings"
                                className="btn btn-sm btn-outline-secondary action-btn">
                                <i className="ion-gear-a" />
                                &nbsp;
                                Edit Profile Settings
                            </Link>
                        }
                        
                        { !loading && !props.isCurrentUser &&
                            <FollowButton username={props.username}
                                following={props.following} />
                        }
                    </div>
                </div>
            </div>
        </div>
    
        <div className="container" style={{ position: 'relative' }}>
            <LoadMask loading={!loading && loadingArticles} />
        
            <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                    <div className="articles-toggle">
                        <ul className="nav nav-pills outline-active">
                            <MyArticlesTab tab={tab} setTab={setTab} />
                    
                            <FavoritedArticlesTab tab={tab} setTab={setTab} />
                        </ul>
                    </div>
                
                    <ArticleList {...props} />
                </div>
            </div>
        </div>
    </div>
);

const ProfilePage = withBindings({
    loading: 'loading',
    image: 'profile.image',
    username: 'profile.username',
    bio: 'profile.bio',
    following: 'profile.following',
    loadingArticles: 'loadingArticles',
    tab: {
        key: 'tab',
        publish: true,
    },
    articles: 'articles',
    articlesCount: 'articlesCount',
    page: 'page',
    limit: 'limit',
    isCurrentUser: $get => $get('user.username') === $get('profile.username'),
})(ProfilePageBase);

export default Profile;
