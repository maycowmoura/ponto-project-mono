import React, { useEffect, useRef } from 'react';
import './style.scss';
import { FiArrowLeft } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';


export default function Search({ closeSearch, originalData, setFiltredData }) {
  const input = useRef();


  useEffect(() => {
    window.location.hash = 'search';
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
    let value = removeAccents(e.target.value.trim().toLowerCase());

    if (!value.length) {
      setFiltredData(originalData);

    } else {
      setFiltredData(originalData.filter(employer => {
        const joined = removeAccents(employer.name.toLowerCase())
          + ' ' + removeAccents(employer.job.toLowerCase())
          + ' ' + removeAccents(employer.place.toLowerCase());
        return (joined).includes(value);
      }))
    }
  }



  function cleanSearch() {
    input.current.value = '';
    input.current.focus();
    setFiltredData(originalData);
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
        placeholder="Pesquisar nome, função ou local"
      />
      <div onClick={cleanSearch}>
        <MdClose />
      </div>
    </div>
  )
}