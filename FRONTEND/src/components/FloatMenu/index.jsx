import React, { useEffect } from 'react';
import './style.scss';


export default function FloatMenu({ title = '', closeMenu, children }) {

  useEffect(() => {
    window.location.hash = 'float-menu';
    document.body.classList.add('float-menu');

    const handleHashChange = () => window.location.hash !== '#float-menu' && closeMenu();
    setTimeout(() => window.addEventListener('hashchange', handleHashChange), 10);

    return () => {
      window.location.hash === '#float-menu' && window.history.back();
      document.body.classList.remove('float-menu');
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, [])


  return (
    <div id="float-menu" onClick={closeMenu}>
      <div id="float-menu-inner" onClick={e => e.stopPropagation()}>
        <h4>{title}</h4>
        {children}
      </div>
    </div>
  )
}