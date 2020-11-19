import React from 'react';
import './style.scss';
import { FiAlertTriangle, FiHelpCircle, FiX } from 'react-icons/fi';

export default function ToastMsg({ text, info, close, aboveAll}) {
  const lineBreakedText = text.split(/\n/g).map((text, i) => 
    <React.Fragment key={i}>
      {text} <br />
    </React.Fragment>
  );

  return (
    <div
      id="toast-msg"
      className={(info ? 'info' : '') + (aboveAll ? ' above-all' : '')}
      onClick={() => close && close()}
    >
      {close && <span><FiX /></span>}

      {info ? <FiHelpCircle /> : <FiAlertTriangle />}
      <div>{lineBreakedText}</div>
    </div>
  );
}