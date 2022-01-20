import React from 'react';
import Store from 'statium';
import { useParams } from 'react-router';

import EditorForm from '../components/Editor/Form.jsx';

import { emptyArticle } from '../actions/article.js';

const initialState = {
  busy: false,
  errors: null,
  article: emptyArticle,
};

const Editor = () => {
  const { slug } = useParams();

  // Note that the slug parameter comes from the URL, and changes dynamically
  // between renderings. Because of this, we cannot make it a Store state key
  // and pass as data key instead so that it will be available for all downstream
  // components without having to expose them to implementation detail of where
  // this parameter comes from.
  return (
    <Store tag="Editor" data={{ slug }} initialState={initialState}>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <EditorForm />
            </div>
          </div>
        </div>
      </div>
    </Store>
  );
};

export default Editor;
