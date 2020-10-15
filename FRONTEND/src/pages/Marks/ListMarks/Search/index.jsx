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

    if(!value.length){
      setFiltredData(originalData);

    } else {
      setFiltredData(originalData.filter(employer => {
        const name = removeAccents(employer.name.toLowerCase());
        const job = removeAccents(employer.job.toLowerCase());
        return name.includes(value) || job.includes(value);
      }))
    }
  }



  function cleanSearch() {
    input.current.value = '';
    input.current.focus();
    setFiltredData(originalData);
  }


  function closeAndCleanSearch(){
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
        placeholder="Pesquisar nome ou função"
      />
      <div onClick={cleanSearch}>
        <MdClose />
      </div>
    </div>
  )
}