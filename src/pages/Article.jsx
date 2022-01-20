import React from 'react';
import Store from 'statium';
import { useParams } from 'react-router';

import LoadMask from '../components/LoadMask.jsx';
import ErrorList from '../components/ErrorList.jsx';

import ArticleView from '../components/Article/View.jsx';

const ArticlePage = () => {
  const { slug } = useParams();

  const initialState = {
    busy: true,
    article: null,
    errors: null,
  };

  // Note that the slug parameter comes from the URL, and changes dynamically
  // between renderings. Because of this, we cannot make it a Store state key
  // and pass as data key instead so that it will be available for all downstream
  // components without having to expose them to implementation detail of where
  // this parameter comes from.
  return (
    <Store tag="ArticlePage" data={{ slug }} initialState={initialState}>
    {({ state: { busy, errors } }) => (
      <>
        <LoadMask loading={busy} />

        {errors && <ErrorList errors={errors} />}

        <ArticleView />
      </>
    )}
    </Store>
  );
};

export default ArticlePage;
