import React, { useEffect, useState, useRef } from 'react';
import './style.scss';


export default function FloatName({ cardRef, employerName, expanded }) {
  const isShowing = useRef(false);
  const [show, setShow] = useState(false);

  
  useEffect(() => {
    function scrollSpy() {
      const pos = cardRef.current?.getBoundingClientRect();

      if (!isShowing.current && pos.top < 0 && pos.bottom > 150) {
        setShow(true);
        isShowing.current = true;

      } else if (isShowing.current && (pos.top > 0 || pos.bottom < 150)) {
        setShow(false);
        isShowing.current = false;
      }
    }

    expanded
      ? window.addEventListener('scroll', scrollSpy)
      : window.removeEventListener('scroll', scrollSpy)

    return () => window.removeEventListener('scroll', scrollSpy);
  }, [expanded])



  return show && expanded
    ? <h3 className="float-name"> {employerName}</h3>
    : <></>;
}
