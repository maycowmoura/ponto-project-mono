import React, { useEffect } from 'react';
import './style.scss';
import { AiOutlineLoading3Quarters as Loader } from 'react-icons/ai';

export default function LoadingInner({ text, fixed, loaderSize, loaderColor }) {
  
  useEffect(() => {
    if(!fixed) return;

    document.body.classList.add('no-scroll', 'no-events');
    return () => document.body.classList.remove('no-scroll', 'no-events');
  }, [])


  return (
    <div id="loading-inner" className={fixed ? 'fixed' : ''} onClick={e => e.stopPropagation()}>
      <Loader size={loaderSize} color={loaderColor} />
      
      {text && <span>{text}</span>}
    </div>
  )
}