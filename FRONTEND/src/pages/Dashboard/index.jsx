import React, { useState } from 'react';
import Header from '../../components/Header';
import './style.scss';
import { useHistory } from 'react-router-dom';
import FloatMenu from '../../components/FloatMenu';
import { ImCalendar } from 'react-icons/im';
import { MdSecurity, MdLocationOn, MdHelpOutline } from 'react-icons/md';
import { FaUserEdit, FaRegCalendarTimes, FaEdit, FaList } from 'react-icons/fa';

export default function Dashboard() {
  const [showMarksMenu, setShowMarksMenu] = useState(false);
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
        <button>
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
              <select className="border" multiple>
                <option value="0" hidden selected>Todos os locais</option>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
              </select>
            </div>

            <ul>
              <li onClick={() => history.push('/marks/set')}>
                <FaEdit /> Editar ou fazer marcações
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