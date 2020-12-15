import React from 'react';
import './App.scss';
import { useMainContext } from './contexts/MainContext';
import { loadTokenFromHashOnSafari, disablePitchZoom } from './utils/OtherUtils';
import Router from './Router';

export default function App() {
  const homepage = '/novoponto';
  const { data } = useMainContext();

  loadTokenFromHashOnSafari();
  disablePitchZoom();

  if (!data && !window.location.pathname.includes('/login')) {
    window.history.pushState(null, null, homepage);
  }

  return <Router homepage={homepage} />
}
