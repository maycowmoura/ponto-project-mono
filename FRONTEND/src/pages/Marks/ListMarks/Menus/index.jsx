import React, { useState } from 'react';
import './style.scss';
import { useListMarks } from '../../../../contexts/MarksContext';
import FloatMenu from '../../../../components/FloatMenu';
import SelectDate from '../../../../components/SelectDate';
import Checkbox from '../../../../components/Checkbox';




export function PeriodMenu({ setShowPeriodMenu }) {
  const { setEmployers, periodFrom, setPeriodFrom, periodTo, setPeriodTo } = useListMarks();
  const [periodFromMirror, setPeriodFromMirror] = useState(periodFrom);
  const [periodToMirror, setPeriodToMirror] = useState(periodTo);

  function handleFilterButton() {
    setPeriodFrom(periodFromMirror);
    setPeriodTo(periodToMirror);
    setEmployers(null); // quando o useEffect do listMarks detectar essa mudança vai recarregar os employers
    setShowPeriodMenu(false);
  }


  return (
    <FloatMenu title="Escolher período:" className="period-menu" closeMenu={() => setShowPeriodMenu(false)}>
      <p>Começar em:</p>
      <SelectDate
        initialDate={periodFromMirror}
        onChange={setPeriodFromMirror}
      />

      <p>Terminar em:</p>
      <SelectDate
        initialDate={periodToMirror}
        onChange={setPeriodToMirror}
      />
      <button onClick={handleFilterButton}>Filtrar</button>
    </FloatMenu>
  )
}


export function SettingsMenu({ setShowSettingsMenu }) {
  return (
    <FloatMenu title="O que deseja ver?" className="settings-menu" closeMenu={() => setShowSettingsMenu(false)}>
      <Checkbox label="Mostrar horas extras" checked />
      <Checkbox label="Mostrar faltas" checked />
      <Checkbox label="Mostrar fins de semana e feriados trabalhados" checked />
      <button>Continuar</button>
    </FloatMenu>
  )
}



export function CommentMenu({ showComment, setShowComment }) {
  return (
    <FloatMenu title="Comentário" className="comments-menu" closeMenu={() => setShowComment(false)}>
      <div>
        <p>"{showComment}"</p>
        <small>Comentado por Plinio sobre XXX no dia XX/XX/XXXX</small>
      </div>
    </FloatMenu>
  )
}