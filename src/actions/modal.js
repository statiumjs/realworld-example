import { modalKey } from "../symbols.js";

export const modal = async ({ state, set }, params) => {
  if (state[modalKey]) {
    throw new Error(`Displaying multiple modals simultaneously is not supported`);
  }

  let callback;

  const promise = new Promise(resolve => {
    callback = resolve;
  });

  await set({
    [modalKey]: {
      ...params,
      callback,
    },
  });

  const button = await promise;

  await set({ [modalKey]: null });

  return button;
};
