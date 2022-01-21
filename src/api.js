const baseURL = 'https://api.realworld.io/api';

let headers = {
  'Content-Type': 'application/json',
};

const handleResponse = async response => {
  let json;

  try {
    // Responses to some DELETE requests contain empty body,
    // which will result in an exception when trying to parse it.
    json = await response.json();
  }
  catch {
    json = {};
  }

  if (response.ok) {
    return json ?? {};
  }
  else {
    const error = new Error(response.status);

    // Some back end API calls do not conform to the rest of the spec
    // and return plain text error descrptions, e.g. PUT /user
    // In real application we'd file a ticket to fix it on the backend,
    // however in a demo it's easier to accommodate for this discrepancy
    // in the client code.
    if (typeof json === 'object') {
      error.response = json;
    }
    else {
      error.response = {
        errors: {
          error: json,
        },
      }

    }

    throw error;
  }
};

const requests = {
  get: async url => handleResponse(await fetch(baseURL + url)),

  post: async (url, payload) => handleResponse(
    await fetch(baseURL + url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
  ),

  put: async (url, payload) => handleResponse(
    await fetch(baseURL + url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    })
  ),

  delete: async url => handleResponse(
    await fetch(baseURL + url, {
      method: 'DELETE',
      headers,
      body: '',
    })
  ),
};

const User = {
  current: async () => {
    const response = await requests.get('/user');

    return response?.user ?? null;
  },

  login: async (email, password) => {
    const response = await requests.post('/users/login', { user: { email, password } });

    return response?.user ?? null;
  },

  register: async (username, email, password) => {
    const response = await requests.post('/users', {
      user: {
        username,
        email,
        password
      },
    });

    return response?.user ?? null;
  },

  save: async user => {
    const response = await requests.put('/user', { user });

    return response?.user ?? null;
  },
}

// Shameless copypasta from react-redux realworld example
const limitedUrl = (page, limit) =>
  `limit=${limit}&offset=${page ? page * limit : 0}`;

const Articles = {
  all: (page, limit) => requests.get('/articles?' + limitedUrl(page, limit)),

  feed: (page, limit) => requests.get('/articles/feed?' + limitedUrl(page, limit)),

  byTag: (tag, page, limit) =>
    requests.get(`/articles?tag=${encodeURIComponent(tag)}&` + limitedUrl(page, limit)),

  bySlug: async slug => {
    const response = await requests.get(`/articles/${slug}`);

    return response?.article ?? null;
  },

  byAuthor: async (username, page, limit) =>
    requests.get('/articles?author=' + encodeURIComponent(username) + '&' +
      limitedUrl(page, limit)),

  favoritedBy: async (username, page, limit) =>
    requests.get('/articles?favorited=' + encodeURIComponent(username) + '&' +
      limitedUrl(page, limit)),

  create: async (slug, article) => {
    const response = await requests.post('/articles', { article });

    return response?.article ?? null;
  },

  update: async (slug, data) => {
    const article = { ...data };
    delete article.slug;

    const response = await requests.put(`/articles/${slug}`, { article });

    return response?.article ?? null;
  },

  delete: slug => requests.delete(`/articles/${slug}`),

  getComments: async slug => {
    const response = await requests.get(`/articles/${slug}/comments`);

    return response?.comments ?? [];
  },

  postComment: async (slug, text) => {
    const response = await requests.post(`/articles/${slug}/comments`, {
      comment: {
        body: text,
      },
    });

    return response?.comment ?? null;
  },

  deleteComment: async (slug, commentId) =>
    requests.delete(`/articles/${slug}/comments/${commentId}`),

  favorite: async slug => {
    const response = await requests.post(`/articles/${slug}/favorite`);

    return response?.article ?? null;
  },

  unfavorite: async slug => {
    const response = await requests.delete(`/articles/${slug}/favorite`);

    return response?.article ?? null;
  },
};

const Tags = {
  all: () => requests.get('/tags'),
};

const Profile = {
  get: async username => {
    const response = await requests.get(`/profiles/${username}`);

    return response?.profile ?? null;
  },

  follow: async username => {
    const response = await requests.post(`/profiles/${username}/follow`);

    return response?.profile ?? null;
  },

  unfollow: async username => {
    const response = await requests.delete(`/profiles/${username}/follow`);

    return response?.profile ?? null;
  },
};

export const API = {
  User,
  Articles,
  Tags,
  Profile,
};

const getApi = token => {
  headers = {
    ...headers,
    ...token ? { authorization: `Token ${token}` } : {},
  };

  return API;
};

export default getApi;