import { alertsKey } from "../symbols.js";
import { displayAlert } from "./alerts.js";

describe("alerts action", () => {
  let state, set;

  beforeEach(() => {
    state = {};
    set = jest.fn();
  });

  it("should add to alerts array when dispatched", async () => {
    state = { [alertsKey]: [] };

    await displayAlert({ state, set }, {
      title: "foo bar",
      content: "baz qux",
    });

    expect(set).toHaveBeenCalledWith({
      [alertsKey]: [{
        id: 0,
        title: "foo bar",
        content: "baz qux",
      }],
    });
  });
});