import React from 'react';
import './style.scss';
import { AiOutlineLoading3Quarters as Loader } from 'react-icons/ai';

export default function LoadingInner({ text, loaderSize, loaderColor }) {
  return (
    <div id="loading-inner">
      <Loader size={loaderSize} color={loaderColor} />
      
      {text && <span>{text}</span>}
    </div>
  )
}