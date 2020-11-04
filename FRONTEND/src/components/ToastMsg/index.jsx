import React from 'react';
import './style.scss';
import { FiAlertTriangle, FiHelpCircle } from 'react-icons/fi';

export default function ToastMsg({ text, info, close, aboveAll}) {

  return (
    <div
      id="toast-msg"
      className={(info ? 'info' : '') + (aboveAll ? ' above-all' : '')}
      onClick={() => close && close()}
    >
      {info ? <FiHelpCircle /> : <FiAlertTriangle />}
      <div>{text}</div>
    </div>
  );
}