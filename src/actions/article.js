import { modal } from './modal.js';
import { displayAlert } from './alerts.js';
import API from '../api.js';

export const emptyArticle = {
  title: '',
  description: '',
  body: '',
  tagList: [],
};

export const loadArticle = async ({ state, set }, { slug, loadComments, loadProfile }) => {
  const { user } = state;

  if (slug) {
    try {
      await set({ busy: true });

      const article = await API.Articles.bySlug(slug);

      if (loadComments) {
        article.comments = await API.Article.getComments(slug);
      }

      // We load author profile in article display page, to correctly render
      // the Following button -- need to know if the current user follows that
      // author or not. It doesn't make sense to make additional request when
      // the author is current user, or if we're not logged in.
      if (loadProfile && user && article.author.username !== user.username) {
        article.author = await API.Profile.get(article.author.username);
      }

      await set({
        article,
        errors: null,
        busy: false,
      });
    }
    catch (e) {
      await set({
        errors: e.response?.errors,
        busy: false,
      });
    }
  }
  else {
    await set({
      article: emptyArticle,
      busy: false,
    });
  }
};

export const postArticle = async ({ data, state, set, dispatch }) => {
  const { article } = state;
  const { slug } = article;

  // When a new article is created, the slug is undefined
  const apiFn = slug ? API.Article.update : API.Article.create;
  const msg = slug ? 'Article was updated successfully!' : 'New article was posted sucessfully!';

  await set({ busy: true });

  try {
    const updated = await apiFn(slug, article);

    await set({
      article: updated,
      busy: false,
    });

    await dispatch(displayAlert, {
      type: "success",
      timeout: 10000,
      text: (
        <span>
          {msg} Keep editing, or&nbsp;
          <a className="alert-link" href={`/article/${updated.slug}`}>
            view it here.
          </a>
        </span>
      )
    });

    data.navigate(`/editor/${updated.slug}`);
  }
  catch (e) {
    await set({
      errors: e.response?.errors,
      busy: false,
    });
  }
};

export const deleteArticle = async ({ data, state, set, dispatch }, slug) => {
  const { article: { title } } = state;

  const yesButton = <button className="btn btn-primary">Yes!</button>;

  const result = await dispatch(modal, {
    title: "Confirm deleting article",
    content: `Are you sure you want to delete the article titled ${title}?`,
    buttons: [
      yesButton,
      <button className="btn btn-secondary">No, keep it for now</button>
    ]
  });

  if (result !== yesButton) {
    return;
  }

  await set({ busy: true });

  try {
    // If no error is thrown, request was successful.
    await API.Article.delete(slug);

    await dispatch(displayAlert, {
      type: "success",
      text: `Article titled ${title} was deleted successfully.`
    });

    // Deletion is allowed only in the full Arcticle view, and
    // after the article is deleted there is nothing to display.
    data.navigate('/');
  }
  catch (e) {
    await set({
      errors: e.response?.errors,
      busy: false,
    });

    await dispatch(displayAlert, {
      type: "error",
      text: `There was an error deleting article titled ${title}`,
    })
  }
};

export const postComment = async ({ state, set, dispatch }, { slug, comment }) => {
  const { article } = state;

  try {
    await API.Article.postComment(slug, comment);

    // Refresh comments from the back end at this point
    article.comments = await API.Article.getComments(slug);

    await set({ article });

    await dispatch(displayAlert, {
      type: "success",
      text: `Comment added successfully.`,
    });
  }
  catch (e) {
    await set({
      errors: e.response?.errors,
    });
  }
};

export const deleteComment = async ({ state, set, dispatch }, { slug, commentId }) => {
  const { article } = state;

  const comment = article.comments.find(c => c.id === commentId);
  const author = comment.author.username;
  
  const yesButton = <button className="btn btn-primary">Yes</button>;

  const result = await dispatch(modal, {
    title: "Confirm deleting comment",
    content: (
      <>
        <div>Are you sure you want to delete {author}'s comment saying:</div>
        <div>{comment.body}</div>
      </>
    ),
    buttons: [
      yesButton,
      <button className="btn btn-secondary">No!</button>
    ]
  });

  if (result !== yesButton) {
    return;
  }

  await set({ busy: true });

  try {
    await API.Article.deleteComment(slug, commentId);

    article.comments = await API.Article.getComments(slug);

    await set({
      article,
      busy: false,
    });

    await dispatch(displayAlert, {
      type: "success",
      text: `Successfully removed ${author}'s comment`
    });
  }
  catch (e) {
    await set({
      errors: e.response?.errors,
      busy: false,
    });
  }
};

export const addTag = async ({ state, set }, tag) => {
  const { article } = state;

  const tagSet = new Set(article.tagList).add(tag);

  await set({
    article: {
      ...article,
      tagList: [...tagSet],
    },
  });
};

export const removeTag = async ({ state, set }, tag) => {
  const { article } = state;

  const tagSet = new Set(article.tagList);
  tagSet.delete(tag);

  await set({
    article: {
      ...article,
      tagList: [...tagSet],
    },
  });
};

export const setTab = async ({ data, set }, to) => {
  // Allow this to be configurable in the parent Store depending on the component
  // that dispatches this action
  const { defaultLimit = 10 } = data;

  // We need to reset page and limit explicitly because these values are synchronized
  // with the URL search parameters, and are retained when URL changes via programmatic
  // navigation below. We don't want them to be retained.
  await set({
    page: 0,
    limit: defaultLimit,
  });

  data.navigate(to);
};

const doFavors = async (type, { state, set }, slug) => {
  const { favorited, favoritesCount } = await API.Article[type](slug);

  await set({
    article: {
      ...state.article,
      favorited,
      favoritesCount,
    },
  });
};

export const favorite = (...args) => doFavors('favorite', ...args);
export const unfavorite = (...args) => doFavors('unfavorite', ...args);

const doFollowing = async (type, { state, set }, username) => {
  const profile = await API.Profile[type](username);

  await set({
    article: {
      ...state.article,
      author: profile,
    }
  });
};

export const followAuthor = (...args) => doFollowing('follow', ...args);
export const unfollowAuthor = (...args) => doFollowing('unfollow', ...args);
