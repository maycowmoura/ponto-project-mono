import React, { useEffect, useState, useRef } from 'react';
import './style.scss';


export default function FloatName({ cardRef, employerName }) {
  const isShowing = useRef(false);
  const [show, setShow] = useState(false);

  
  useEffect(() => {
    function scrollSpy() {
      const pos = cardRef.current?.getBoundingClientRect();

      if (!isShowing.current && pos.top < 0 && pos.bottom > 300) {
        setShow(true);
        isShowing.current = true;
        
      } else if (isShowing.current && (pos.top > 0 || pos.bottom < 300)) {
        setShow(false);
        isShowing.current = false;
      }
    }

    const root = document.querySelector('#root');
    root.addEventListener('scroll', scrollSpy)
    return () => root.removeEventListener('scroll', scrollSpy);
  }, [])



  return show
    ? <h3 className="float-name"> {employerName}</h3>
    : <></>;
}
