import { get, post, put, del } from './agent.js';

const User = {
  current: async () => (await get('/user'))?.user ?? null,

  login: async (email, password) => (await post('/users/login', { user: { email, password } }))?.user,

  register: async (username, email, password) => {
    const response = await post('/users', {
      user: {
        username,
        email,
        password
      },
    });

    return response?.user ?? null;
  },

  save: async user => (await put('/user', { user }))?.user,
};

const Profile = {
  get: async username => (await get(`/profiles/${username}`))?.profile,
  follow: async username => (await post(`/profiles/${username}/follow`))?.profile,
  unfollow: async username => (await del(`/profiles/${username}/follow`))?.profile,
};

// Shameless copypasta from react-redux realworld example
const limitedUrl = (page, limit) => `limit=${limit}&offset=${page ? page * limit : 0}`;

const Articles = {
  all: (page, limit) => get('/articles?' + limitedUrl(page, limit)),
  feed: (page, limit) => get('/articles/feed?' + limitedUrl(page, limit)),
  bySlug: async slug => (await get(`/articles/${slug}`))?.article,
  byTag: (tag, page, limit) =>
    get(`/articles?tag=${encodeURIComponent(tag)}&` + limitedUrl(page, limit)),

  byAuthor: (username, page, limit) =>
    get('/articles?author=' + encodeURIComponent(username) + '&' + limitedUrl(page, limit)),

  favoritedBy: (username, page, limit) =>
    get('/articles?favorited=' + encodeURIComponent(username) + '&' + limitedUrl(page, limit)),
};

const Article = {
  create: async (slug, article) => (await post('/articles', { article }))?.article,

  update: async (slug, data) => {
    const article = { ...data };
    delete article.slug;

    return (await put(`/articles/${slug}`, { article }))?.article;
  },

  delete: slug => del(`/articles/${slug}`),

  getComments: async slug => (await get(`/articles/${slug}/comments`))?.comments,
  postComment: async (slug, text) => {
    const response = await post(`/articles/${slug}/comments`, {
      comment: {
        body: text,
      },
    });

    return response?.comment ?? null;
  },

  deleteComment: async (slug, commentId) => del(`/articles/${slug}/comments/${commentId}`),

  favorite: async slug => (await post(`/articles/${slug}/favorite`))?.article,
  unfavorite: async slug => (await del(`/articles/${slug}/favorite`))?.article,
};

const Tags = {
  all: () => get('/tags'),
};

const API = {
  User,
  Profile,
  Articles,
  Article,
  Tags,
};

export default API;
