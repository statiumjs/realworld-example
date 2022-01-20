import React from 'react';
import { useStore } from 'statium';

const defaultOptions = [
  { value: 10 },
  { value: 25 },
  { value: 50 },
];

const LimitSelect = () => {
  const { data, state: { limit }, set } = useStore();
  const options = data.articleLimitOptions || defaultOptions;

  return (
    <li className="nav-item pull-xs-right">
      <span>Articles to display:&nbsp;</span>

      <select className="custom-select"
        value={limit}
        onChange={e => set({ limit: Number(e.target.value) })}>

        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.text || o.value}
          </option>
        ))}
      </select>
    </li>
  );
};

export default LimitSelect;
