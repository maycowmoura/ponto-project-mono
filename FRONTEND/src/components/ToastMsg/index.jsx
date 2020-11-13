import React from 'react';
import './style.scss';
import { FiAlertTriangle, FiHelpCircle } from 'react-icons/fi';

export default function ToastMsg({ text, info, close, aboveAll}) {
  const lineBreakedText = text.split(/\n/g).map(text => <>{text} <br /></>);

  return (
    <div
      id="toast-msg"
      className={(info ? 'info' : '') + (aboveAll ? ' above-all' : '')}
      onClick={() => close && close()}
    >
      {info ? <FiHelpCircle /> : <FiAlertTriangle />}
      <div>{lineBreakedText}</div>
    </div>
  );
}