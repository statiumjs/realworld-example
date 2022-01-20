import React from 'react';
import { useStore } from 'statium';

import { favorite, unfavorite } from '../../actions/article.js';

import './FavIcon.css';

const FavIcon = ({ slug, compact = true }) => {
  const { state, dispatch } = useStore();

  const user = state.user;
  const favorited = state.article?.favorited;
  const favoritesCount = state.article?.favoritesCount;

  // Non-authenticated users cannot favorite. We display a span
  // instead of a button in that case. The CSS is copied from
  // btn-outline-primary without the hover inversion.
  if (!user) {
    return (
      <span className="btn btn-sm favicon-outline-primary"
        title="Cannot favorite articles when not signed in">
        <i className="ion-heart" /> {favoritesCount}
      </span>
    );
  }

  const cls = `btn btn-sm ${favorited ? 'btn-primary' : 'btn-outline-primary'}`;
  const title = !favorited ? "Love this!" : "Nah, not so good";

  const content = compact
    ? <span>{favoritesCount}</span>
    : (
        <>
          <span>{!favorited ? "Favorite Article" : "Unfavorite Article"}</span>
          <span> ({favoritesCount})</span>
        </>
      );

  return (
    <button className={cls}
      title={title}
      disabled={!user}
      onClick={e => dispatch(favorited ? unfavorite : favorite, slug)}>
      <i className="ion-heart" /> {content}
    </button>
  );
}

export default FavIcon;
