import React, { useContext } from 'react';
import './style.scss';
import MarksContext from '../../../../contexts/MarksContext';
import FloatMenu from '../../../../components/FloatMenu';
import SelectDate from '../../../../components/SelectDate';
import Checkbox from '../../../../components/Checkbox';




export function PeriodMenu({ setShowPeriodMenu }) {
  const { listMarks:{ periodFrom, periodTo } } = useContext(MarksContext);

  return (
    <FloatMenu title="Escolher período:" closeMenu={() => setShowPeriodMenu(false)}>
      <div className="period-menu">
        <p>Começar em:</p>
        <SelectDate
          initialDate={periodFrom.current}
          setDate={date => periodFrom.current = date}
        />

        <p>Terminar em:</p>
        <SelectDate
          initialDate={periodTo.current}
          setDate={date => periodTo.current = date}
        />
        <button onClick={null}>Filtrar</button>
      </div>
    </FloatMenu>
  )
}


export function SettingsMenu({ setShowSettingsMenu }) {
  return (
    <FloatMenu title="O que deseja ver?" closeMenu={() => setShowSettingsMenu(false)}>
      <div className="settings-menu">
        <Checkbox label="Mostrar horas extras" checked />
        <Checkbox label="Mostrar faltas" checked />
        <Checkbox label="Mostrar fins de semana e feriados trabalhados" checked />
        <button>Continuar</button>
      </div>
    </FloatMenu>
  )
}



export function CommentMenu({ showComment, setShowComment }) {
  return (
    <FloatMenu title="Comentário" closeMenu={() => setShowComment(false)}>
      <div className="comments-menu">
        <p>"{showComment}"</p>
        <small>Comentado por Plinio sobre XXX no dia XX/XX/XXXX</small>
      </div>
    </FloatMenu>
  )
}