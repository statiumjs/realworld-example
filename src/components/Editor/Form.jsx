import React, { useEffect } from 'react';
import { useStore } from 'statium';

import LoadMask from '../LoadMask.jsx';
import ErrorList from '../ErrorList.jsx';
import TagInput from './TagInput.jsx';

import { loadArticle, postArticle } from '../../actions/article.js';

// The most basic check is having non-empty title and body
const isReady = ({ article }) => article && article.title && article.body;

export const EditorForm = () => {
  const { data, state, set, dispatch } = useStore();
  const { busy, article, errors } = state;
  const { slug } = data;

  // We don't _really_ need to include dispatch function in the list of dependencies
  // for useEffect hook since the function identity is stable and will not ever change.
  // ESLint rules for hooks are not aware of that though, and will complain about
  // missing dependency.
  useEffect(() => {
    dispatch(loadArticle, { slug, loadComments: false, loadProfile: false });
  }, [slug, dispatch]);

  // One of the fields in this form is the tag editor that has special
  // functionality: pressing Enter key in it should take its current value
  // and add it as a tag to the list of article tags. We use keyUp event
  // to handle this in the TagInput component.
  // Unfortunately, the default action for pressing Enter key in a form field
  // (triggering the submit button and firing the submit event) is fired before
  // the keyUp event in the input element itself.
  // Rather than working around this in a complicated way and sacrifice
  // demo code readability, we limit the form submission to clicking
  // the submit button instead.
  return (
    <>
      <LoadMask loading={busy} />

      <ErrorList errors={errors || {}} />

      <form>
        <fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Article Title"
              value={article.title}
              onChange={e => set({ article: { ...article, title: e.target.value } })}
              />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="What this article is about?"
              value={article.description}
              onChange={e => set({ article: { ...article, description: e.target.value } })}
              />
          </fieldset>

          <fieldset className="form-group">
            <textarea
              className="form-control"
              rows="8"
              placeholder="Write your article here (in markdown)"
              value={article.body}
              onChange={e => set({ article: { ...article, body: e.target.value } }) }
               />
          </fieldset>

          <fieldset className="form-group">
            <TagInput />
          </fieldset>

          <button type="button" className="btn btn-lg btn-primary pull-xs-right"
            onClick={() => dispatch(postArticle)}
            disabled={!isReady(state)}
          >
            {slug ? "Update Article" : "Publish Article"}
          </button>
        </fieldset>
      </form>
    </>
  );
};

export default EditorForm;
