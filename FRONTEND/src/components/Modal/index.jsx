import React, { useEffect } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';


export default function Modal({ children, close = ()=>{} }) {
  const history = useHistory();

  useEffect(() => {
    history.push('#modal');
    document.body.classList.add('no-scroll');

    const handleHashChange = () => window.location.hash !== 'modal' && close();
    setTimeout(() => window.addEventListener('hashchange', handleHashChange), 10);

    return () => {
      window.location.hash === '#modal' && window.history.back();
      document.body.classList.remove('no-scroll');
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, [])


  return (
    <div id="modal" onClick={() => close && close()}>
      <div id="modal-inner" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}