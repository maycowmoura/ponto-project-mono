import React, { useState, useEffect } from 'react';
import './style.scss';
import { useMainContext } from '../../contexts/MainContext';
import { useSetMarks } from '../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import ToastMsg from '../../components/ToastMsg';
import FloatMenu from '../../components/FloatMenu';
import { ImCalendar } from 'react-icons/im';
import { MdSecurity, MdLocationOn, MdHelpOutline } from 'react-icons/md';
import { FaUserEdit, FaRegCalendarTimes, FaList } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';


export default function Dashboard() {
  const [showMarksMenu, setShowMarksMenu] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { data, setPlaceFilters } = useMainContext();
  const { setDayMarks, setIndex } = useSetMarks();
  const history = useHistory();
  const hasMultiplePlaces = data.places.length > 1;

  // history.push('/login/abc');

  useEffect(() => {
    setDayMarks(null);
    setIndex(0);
    setPlaceFilters('');
  }, [])


  function handleManagePointClick(){
    if(!data.places.length && !data.employers.length){
      return setErrorMsg('Adicione ao menos um local e um funcionário antes de continuar.');
    }

    setShowMarksMenu(true);
  }


  function handleSelectFilterPlace(e) {
    const value = Array.from(e.target.selectedOptions)
      .map(option => option.value)
      .join(',');
    setPlaceFilters(value);
  }


  return (
    <div id="dashboard">
      <Header>
        <div className="title">Gerenciador de Ponto</div>
      </Header>

      <main>
        <button onClick={handleManagePointClick}>
          <ImCalendar /> Marcações de Ponto
        </button>
        <button onClick={() => history.push('/dashboard/places')}>
          <MdLocationOn /> Locais de Trabalho
        </button>
        <button onClick={() => history.push('/dashboard/employers')}>
          <FaUserEdit /> Gerenciar Funcionários
        </button>
        <button>
          <MdSecurity /> Gerenciar Acessos
        </button>
        <button onClick={() => history.push('/dashboard/close-point')}>
          <FaRegCalendarTimes /> Fechar Ponto
        </button>
        <button onClick={() => history.push('/help')}>
          <MdHelpOutline /> Me Ajuda
        </button>
      </main>


      {showMarksMenu &&
        <FloatMenu title="Gerenciar marcações" className="marks-menu" closeMenu={() => setShowMarksMenu(false)}>
          {hasMultiplePlaces &&
            <div className="filter-by-place">
              <label>Filtrar por local:</label>
              <select
                className="border"
                multiple
                defaultValue=""
                onChange={handleSelectFilterPlace}
              >
                <option value="" hidden selected>Todos os locais</option>
                {data.places.map(({ id, name }) =>
                  <option key={id} value={id}>{name}</option>
                )}
              </select>
            </div>
          }

          <ul>
            <li onClick={() => history.push('/marks/set')}>
              <FiEdit /> Editar ou fazer marcações
              </li>
            <li onClick={() => history.push('/marks/list')}>
              <FaList /> Listar marcações
            </li>
          </ul>
        </FloatMenu>
      }
      
      {errorMsg && <ToastMsg text={errorMsg} close={setErrorMsg} />}
    </div>
  );
}