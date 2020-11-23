import React, { useEffect } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';

export default function FloatMenu({ title = '', closeMenu, children, className }) {
  const history = useHistory();

  useEffect(() => {
    history.push('#float-menu');
    document.body.classList.add('no-scroll');

    const handleHashChange = () => window.location.hash !== '#float-menu' && closeMenu();
    setTimeout(() => window.addEventListener('hashchange', handleHashChange), 10);

    return () => {
      window.location.hash === '#float-menu' && window.history.back();
      document.body.classList.remove('no-scroll');
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, [])


  return (
    <div id="float-menu" onClick={() => closeMenu && closeMenu()}>
      <div id="float-menu-inner" className={className} onClick={e => e.stopPropagation()}>
        <h4>{title}</h4>
        {children}
      </div>
    </div>
  )
}