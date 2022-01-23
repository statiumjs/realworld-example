const API = {
  User: {
    current: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    save: jest.fn(),
  },
  Articles: {
    all: jest.fn(),
    feed: jest.fn(),
    byTag: jest.fn(),
    bySlug: jest.fn(),
    byAuthor: jest.fn(),
    favoritedBy: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getComments: jest.fn(),
    postComment: jest.fn(),
    deleteComment: jest.fn(),
    favorite: jest.fn(),
    unfavorite: jest.fn(),
  },
  Tags: {
    all: jest.fn(),
  },
  Profile: {
    get: jest.fn(),
    follow: jest.fn(),
    unfollow: jest.fn(),
  }
}

export default API;
