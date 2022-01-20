import React from 'react';
import Store from 'statium';

import { addTag, removeTag } from '../../actions/article.js';

const addTagAndClearInput = async ({ state, set, dispatch }) => {
  const { tagInput } = state;

  await dispatch(addTag, tagInput);
  await set({ tagInput: '' });
};

const removeTagAndClearInput = async ({ set, dispatch }, tag) => {
  await dispatch(removeTag, tag);
  await set({ tagInput: '' });
};

const TagInput = () => (
  <Store tag="TagInput" initialState={{ tagInput: '' }}>
  {({ state, set, dispatch }) => {
    const tagList = state.article?.tagList ?? [];

    const onKeyUp = e => {
      // React DOM event handlers are invoked synchronously,
      // and we need to call preventDefault() here
      // before dispatching a Store action which is
      // asynchronous and is scheduled for the next event loop.
      // If we simply pass the event object to Store action
      // handler, by the time it fires the event will have
      // caused the default action and preventDefault() call
      // will be ineffective.
      if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();

        if (state.tagInput !== '') {
          dispatch(addTagAndClearInput);
        }
      }
    };

    return (
      <>
        <input className="form-control"
          type="text"
          placeholder="Enter tags"
          value={state.tagInput}
          onChange={e => set({ tagInput: e.target.value })}
          onKeyUp={onKeyUp}
        />

        <div className="tag-list">
          {tagList.map(tag => (
            <span key={tag} className="tag-default tag-pill">
              <i className="ion-close-round"
                onClick={e => {
                  e.preventDefault();

                  dispatch(removeTagAndClearInput, tag);
                }}
              />
              {tag}
            </span>
          ))}
        </div>
      </>
    )
  }}
  </Store>
);

export default TagInput;
