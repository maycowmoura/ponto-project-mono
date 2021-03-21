import React from 'react';
import './style.scss';
import FloatMenu from '../../../../components/FloatMenu';
import { useHistory } from 'react-router-dom';
import { useSetMarks } from '../../../../contexts/MarksContext';
import { MdViewAgenda as List, MdHelp as Help } from 'react-icons/md';
import { FaFilter as FilterIcon } from 'react-icons/fa';


export default function Menu({ close }) {
  const history = useHistory();
  const { dayMarks, setDayMarks, dayMarksBackup } = useSetMarks();
  const hasFilters = dayMarks?.length !== dayMarksBackup?.length;
  const defaultValue = hasFilters ? dayMarks.map(item => item.id) : [0];

  function handleFilterDayMarks(e) {
    const filtredIds = Array.from(e.target.selectedOptions)
      .filter(option => option.value != 0) //eslint-disable-line
      .map(option => Number(option.value));

    // se não tiver filtros restaura as marks
    if (!filtredIds.length) {
      setDayMarks(dayMarksBackup);
      return close();
    }

    const filtredMarks = dayMarksBackup.filter(mark => filtredIds.includes(Number(mark.id)))
    setDayMarks(filtredMarks);
    close();
  }

  function clearFilters() {
    setDayMarks(dayMarksBackup);
    close();
  }


  return (
    <FloatMenu className="set-marks-menu" title="Mais opções" closeMenu={close}>
      <ul>
        <li className="select-filter">
          {hasFilters && <small onClick={clearFilters}>Limpar<br />filtros</small>}
          <label><FilterIcon /> Filtrar Funcionários</label>

          <select
            className="border"
            multiple
            defaultValue={defaultValue}
            onChange={handleFilterDayMarks}
          >
            <option value="0" hidden>Selecionar filtro</option>
            {dayMarksBackup.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

        </li>

        <li onClick={() => history.push('/marks/list')}>
          <List /> Listar marcações
        </li>

        <li onClick={() => history.push('/help')}>
          <Help /> Me ajuda
        </li>

      </ul>
    </FloatMenu>
  );
}
