import React from 'react';
import './App.scss';
import { MainContextProvider, useMainContext } from './contexts/MainContext';
import Router from './Router';


document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, {passive: false})


export default function App() {
  const homepage = '/novoponto';
  const { data } = useMainContext();

  if (!data && !window.location.pathname.includes('/login')) {
    window.history.pushState(null, null, homepage);
  }

  return <Router homepage={homepage} />
}
