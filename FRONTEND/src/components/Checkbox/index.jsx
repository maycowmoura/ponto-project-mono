import React, { useState } from 'react';
import './style.scss';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

export default function Checkbox({ label, checked }) {
  const [isChecked, setIsChecked] = useState(checked)

  return (
    <label className="checkbox">
      <input
        type="checkbox"
        onChange={e => setIsChecked(e.target.checked)}
        checked={isChecked}
      />
      {isChecked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
      {label}
    </label>
  );
}