import React from 'react';
import './style.scss';
import { useSetMarks } from '../../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import { ImEnter, ImExit } from 'react-icons/im'

export default function Input({ type, value, invalid = false }) {
  const history = useHistory();
  const { setActiveInput } = useSetMarks();
  const invalidClass = invalid ? 'invalid' : '';

  function handleClick() {
    setActiveInput(type);
    history.push('/marks/set/typing');
  }

  return (
    <div className={`mark-input ${type} ${invalidClass}`} onClick={handleClick}>
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