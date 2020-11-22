import React, { useRef, useEffect } from 'react';

export default function MainTag({ children }) {
  const main = useRef();

  useEffect(() => {
    setTimeout(() => main.current.style.animationName = 'none', 700)
  }, [])


  return <main ref={main}>{children}</main>;
}