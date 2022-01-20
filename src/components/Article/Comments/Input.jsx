import React from 'react';
import Store from 'statium';

import { postComment } from '../../../actions/article.js';

import LoadMask from '../../LoadMask.jsx';
import Userpic from '../../Userpic.jsx';
import ErrorList from '../../ErrorList.jsx';

// Use a Symbol key to avoid collisions with parent Store keys.
// We are using Symbol.for() here because the normal Symbol('foo')
// call will create a new Symbol every time the application code
// is edited.
// This is due to how hot reloading works in create-react-app
// dev environment: when code is updated and saved, the browser
// will load the difference and appy it to existing component tree.
// At that point the Store will have been configured with a Symbol
// key name that no longer exists and new code will try to use the
// new Symbol, which would result in cryptic exceptions about
// not being able to find a Store that provides state key Symbol(foo),
// although of course it will work upon full page reload.
// This is a development only issue, it does not affect
// production code, and workaround is very simple: define the
// Symbol keys in a separate file that contains only constants
// and import it from there.
const errorsKey = Symbol.for('errors');

const initialState = {
  postingComment: false,
  comment: '',
  [errorsKey]: null,
};

const postCommentAndClearInput = async ({ state, set, dispatch }, slug) => {
  await set({ postingComment: true });

  try {
    await dispatch(postComment, { slug, comment: state.comment });

    await set({
      comment: '',
      postingComment: false,
    });
  }
  catch (e) {
    await set({
      [errorsKey]: e.response?.errors,
      postingComment: false,
    });
  }
};

const CommentInput = ({ slug }) => (
  <Store tag="Comment-form" initialState={initialState}>
  {({ state, set, dispatch }) => {
    const { user, comment, postingComment } = state;

    const onClick = async e => {
      e.preventDefault();
      dispatch(postCommentAndClearInput, slug);
    };

    return (
      <form className="card comment-form">
        <LoadMask loading={postingComment} />

        { state[errorsKey] && <ErrorList errors={state[errorsKey]} /> }

        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment"
            value={comment}
            onChange={e => set({ comment: e.target.value }) }
            rows="3" />
        </div>

        <div className="card-footer">
          <Userpic src={user?.image}
            className="comment-author-img"
            alt={user?.username} />

          <button className="btn btn-sm btn-primary" type="button"
            disabled={postingComment || comment === ''}
            onClick={onClick}
          >
            Post comment
          </button>
        </div>
      </form>
    )
  }}
  </Store>
);

export default CommentInput;
