import React from 'react';
import { mount } from 'enzyme';

import Modal from './Modal.jsx';

describe("Modal component", () => {
  describe("rendering", () => {
    it("should render hidden modal and no backdrop", async () => {
      const tree = mount(
        <Modal show={false}
          title="foo bar"
          content="frobbe throbbe"
          buttons={[]}
        />
      );

      await sleep();

      tree.update();

      expect(tree).toMatchSnapshot();

      expect(document.body.classList.contains('modal-open')).toBe(false);

      const backdropEl = document.body.querySelector('.modal-backdrop');
      expect(backdropEl).toBe(null);
    });

    it("should render visible modal with backdrop", async () => {
      const tree = mount(
        <Modal show={true}
          title="krung klatz"
          content="froo froo funtz"
          buttons={[]}
        />
      );

      await sleep(10);

      tree.update();

      expect(tree).toMatchSnapshot();

      expect(document.body.classList.contains('modal-open')).toBe(true);

      const backdropEl = document.body.querySelector('.modal-backdrop');
      expect(backdropEl.className).toBe('modal-backdrop fade show');
    });
  });

  describe("buttons", () => {
    let callback;

    beforeEach(() => {
      callback = jest.fn();
    });

    it("should call the callback on close button click", () => {
      const tree = mount(
        <Modal show={true}
          title="plugh kludge"
          content="sorpo asto"
          buttons={[]}
          callback={callback}
        />
      );

      tree.find('button.close').simulate('click');

      expect(callback).toHaveBeenCalledWith(null);
    });

    it("should call the callback on footer button click", () => {
      const fooButton = <button className="foo">foo</button>;

      const tree = mount(
        <Modal show={true}
          title="jurg fropp"
          content="ordo wupp"
          buttons={[fooButton]}
          callback={callback}
        />
      );

      tree.find('button.foo').simulate('click');

      expect(callback).toHaveBeenCalledWith(fooButton);
    });
  });
});
