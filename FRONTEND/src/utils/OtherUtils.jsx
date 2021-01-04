import api from '../api';


export function isNumber(num) {
  return /^-?\d+$/.test(num);
}




export const hasShortcut =
  window.matchMedia('(display-mode: standalone)').matches;




export const isSafari =
  /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);




export function loadDynamicManifestOnSafari() {
  if (isSafari && !hasShortcut) {
    const manifestTag = document.querySelector('link[rel="manifest"]');
    manifestTag.href = manifestTag.href.replace('.json', '.php?ios_token=' + localStorage.token); //loads the dynamic manifest
  }
}



export function loadTokenFromHashOnSafari() {
  if (isSafari && hasShortcut) {
    const hashHasToken = window.location.hash.includes('ios_token');

    if (!localStorage.token && hashHasToken) {
      const token = window.location.hash.replace('#ios_token=', '');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.token = token;
    }
  }
}



export function disablePitchZoom() {
  document.addEventListener('touchmove', e => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false })
}




export function checkForUpdates() {
  function check() {
    const now = Date.now();
    const lastCheck = localStorage.lastUpdateCheck ?? now;
    const diff = (now - lastCheck) / (24 * 60 * 60 * 1000);
    const thisVersion = process.env.REACT_APP_VERSION;
    if (diff < 2 || process.env.NODE_ENV !== 'production') return;

    api.get(window.location.href)
      .then(({ data: html }) => {
        localStorage.lastUpdateCheck = now;
        html.includes(`<template>${thisVersion}</template>`) || window.location.reload(true);
      })
  }

  document.readyState === 'complete'
    ? check()
    : window.addEventListener('load', check);
}