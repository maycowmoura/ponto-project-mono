import React, { useEffect, useRef } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';


export default function Search({ closeSearch, originalData, setMirroredData, keysToFilter, placeholder }) {
  const input = useRef();
  const history = useHistory();


  useEffect(() => {
    history.push('#search');
    input.current.focus();

    const handleHashChange = () => window.location.hash !== '#search' && closeAndCleanSearch();
    setTimeout(() => window.addEventListener('hashchange', handleHashChange), 10);

    return () => {
      window.location.hash === '#search' && window.history.back();
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, [])



  function handleSearch(e) {
    const removeAccents = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    let inputValue = removeAccents(e.target.value.trim().toLowerCase());

    if (!inputValue.length) {
      setMirroredData(originalData);

    } else {
      const filtredData = originalData.filter(item => (
        Object.entries(item)
          .map(([key, val]) => (
            keysToFilter.includes(key) ? removeAccents(val.toLowerCase()) : null
          ))
          .filter(val => val) // remove nulls
          .join(' ')
          .includes(inputValue)
      ))

      setMirroredData(filtredData)
    }
  }



  function cleanSearch() {
    input.current.value = '';
    input.current.focus();
    setMirroredData(originalData);
  }


  function closeAndCleanSearch() {
    cleanSearch();
    closeSearch();
  }



  return (
    <div id="search">
      <div onClick={closeAndCleanSearch}>
        <FiArrowLeft />
      </div>
      <input
        ref={input}
        type="text"
        onChange={handleSearch}
        placeholder={placeholder || 'Buscar...'}
      />
      <div onClick={cleanSearch}>
        <MdClose />
      </div>
    </div>
  )
}