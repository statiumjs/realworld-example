export const loadProfile = async ({ state, set }, username) => {
  await set({ busy: true });

  const profile = await state.api.Profile.get(username);

  await set({ profile });

  await set({ busy: false });
};

export const follow = async ({ state, set }, username) => {
  const profile = await state.api.Profile.follow(username);

  await set({ profile });
};

export const unfollow = async ({ state, set }, username) => {
  const profile = await state.api.Profile.unfollow(username);

  await set({ profile });
};
