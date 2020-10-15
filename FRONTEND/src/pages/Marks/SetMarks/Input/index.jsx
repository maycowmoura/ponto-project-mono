import React, { useContext } from 'react';
import './style.scss';
import MarksContext from '../../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import { ImEnter, ImExit } from 'react-icons/im'

export default function Input({ type, invalid = false }) {
  const history = useHistory();
  const { setMarks: { formatedTime, activeInput, setActiveInput } } = useContext(MarksContext);
  const active = activeInput === type ? 'active' : '';
  const invalidClass = invalid ? 'invalid' : '';
  const value = formatedTime ? formatedTime[type] : ''; ///////////////COLOCAR HORARIO PADRÃO DO DIA

  function handleClick() {
    setActiveInput(type);
    history.push('/marks/set/typing');
  }

  return (
    <div className={`mark-input ${type} ${active} ${invalidClass}`} onClick={handleClick}>
      { type === 'in'
        ? <label><ImEnter /> ENTRADA</label>
        : <label>SAÍDA <ImExit /></label>
      }
      <div className="input">
        {value}
      </div>

      {invalid &&
        <small>
          {typeof (invalid) == 'string'
            ? invalid
            : 'Horário inválido'
          }
        </small>
      }
    </div>
  )
}