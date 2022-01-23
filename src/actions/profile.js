import API from '../api.js';

export const loadProfile = async ({ set }, username) => {
  await set({ busy: true });

  const profile = await API.Profile.get(username);

  await set({ profile, busy: false });
};

export const follow = async ({ set }, username) => {
  const profile = await API.Profile.follow(username);

  await set({ profile });
};

export const unfollow = async ({ set }, username) => {
  const profile = await API.Profile.unfollow(username);

  await set({ profile });
};
