import React from 'react';
import { mount as enzymeMount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

export const mount = cmp =>
  enzymeMount(
    <MemoryRouter>
      {cmp}
    </MemoryRouter>
  );
