import React, { useEffect } from 'react';
import './style.scss';
import { AiOutlineLoading3Quarters as Loader } from 'react-icons/ai';
import { RiErrorWarningLine as Warn } from 'react-icons/ri';

export default function LoadingInner({ text, fixed, loaderSize, loaderColor, error = false }) {

  useEffect(() => {
    if (!fixed) return;

    document.body.classList.add('no-scroll', 'no-events');
    return () => document.body.classList.remove('no-scroll', 'no-events');
  }, [])


  return (
    <div id="loading-inner"
      className={(fixed ? 'fixed' : '') + (error ? ' error' : '')}
      onClick={e => e.stopPropagation()}
    >
      {!error
        ? <Loader size={loaderSize} color={loaderColor} />
        : <Warn />
      }

      {text && <span>{text}</span>}
    </div>
  )
}