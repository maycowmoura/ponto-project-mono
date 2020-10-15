import React from 'react';
import './style.scss';
import { AiOutlineLoading3Quarters as Loader } from 'react-icons/ai';

export default function LoadingInner({ text }) {
  return (
    <div id="loading-inner">
      <Loader />
      <span>{text}</span>
    </div>
  )
}