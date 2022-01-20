import { alertsKey } from '../symbols.js';

let id = 0;

export const displayAlert = async ({ state, set }, params) => {
  await set({
    [alertsKey]: [
      ...state[alertsKey],
      { ...params, id: id++ },
    ],
  })
};
