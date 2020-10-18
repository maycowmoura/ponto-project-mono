import React, { useState, useEffect } from 'react';
import './style.scss';
import { useMainContext } from '../../contexts/MainContext';
import { useSetMarks } from '../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import FloatMenu from '../../components/FloatMenu';
import { ImCalendar } from 'react-icons/im';
import { MdSecurity, MdLocationOn, MdHelpOutline } from 'react-icons/md';
import { FaUserEdit, FaRegCalendarTimes, FaList } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';


export default function Dashboard() {
  const [showMarksMenu, setShowMarksMenu] = useState(false);
  const { data, setPlaceFilter } = useMainContext();
  const history = useHistory();


  return (
    <div id="dashboard">
      <Header>
        <div className="title">Gerenciador de Ponto</div>
      </Header>

      <main>
        <button onClick={setShowMarksMenu}>
          <ImCalendar /> Marcações de Ponto
        </button>
        <button onClick={() => history.push('/dashboard/places')}>
          <MdLocationOn /> Locais de Trabalho
        </button>
        <button>
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
        <FloatMenu title="Gerenciar Marcações" closeMenu={() => setShowMarksMenu(false)}>
          <div className="marks-menu">

            <div className="filter-by-place">
              <label>Filtrar por local:</label>
              <select
                className="border"
                multiple
                onChange={e => setPlaceFilter(e.target.value)}
              >
                <option value="all" hidden selected>Todos os locais</option>
                {data.places.map(({ id, name }) =>
                  <option key={id} value={id}>{name}</option>
                )}
              </select>
            </div>

            <ul>
              <li onClick={() => history.push('/marks/set')}>
                <FiEdit /> Editar ou fazer marcações
              </li>
              <li onClick={() => history.push('/marks/list')}>
                <FaList /> Listar marcações
            </li>
            </ul>
          </div>
        </FloatMenu>
      }
    </div>
  );
}