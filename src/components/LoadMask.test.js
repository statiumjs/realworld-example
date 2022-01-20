import React from 'react';
import { shallow } from 'enzyme';

import LoadMask from './LoadMask.jsx';

describe("LoadMask", () => {
  it("should render hidden by default", () => {
    const tree = shallow(<LoadMask />);

    expect(tree).toMatchSnapshot();
    expect(tree.find('div.load-mask').hasClass('hidden')).toBe(true);
  });

  it("should render visible when loading prop is true", () => {
    const tree = shallow(<LoadMask loading={true} />);

    expect(tree).toMatchSnapshot();
    expect(tree.find('div.load-mask').hasClass('hidden')).toBe(false);
  });
});
