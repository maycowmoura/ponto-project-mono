import React from 'react';
import './style.scss';

export default function SwitcherInput(props) {
  return <input type="checkbox" data-switcher {...props} />
}