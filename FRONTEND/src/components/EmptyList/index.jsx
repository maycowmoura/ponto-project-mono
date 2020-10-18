import React, { useState } from 'react';
import './style.scss';
import { FaRegDizzy } from 'react-icons/fa';

export default function EmptyList({ title, children }) {

  return (
    <div id="empty-list">
      <div>
        <i><FaRegDizzy /></i>
        <h1>{title}</h1>
        <span>{children}</span>
      </div>
    </div>
  );
}