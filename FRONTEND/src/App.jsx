import React from 'react';
import './App.scss';
import { useMainContext } from './contexts/MainContext';
import { loadTokenFromHashOnSafari, disablePitchZoom, checkForUpdates } from './utils/OtherUtils';
import Router from './Router';

export default function App() {
  const homepage = '/ponto';
  const { data } = useMainContext();

  loadTokenFromHashOnSafari();
  disablePitchZoom();
  checkForUpdates();

  if (!data && !window.location.pathname.includes('/login')) {
    window.history.pushState(null, null, homepage);
  }

  return <Router homepage={homepage} />
}
