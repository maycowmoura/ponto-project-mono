import React, { useState } from 'react';
import './style.scss';
import { useListMarks } from '../../../../contexts/MarksContext';
import FloatMenu from '../../../../components/FloatMenu';
import SelectDate from '../../../../components/SelectDate';
import Checkbox from '../../../../components/Checkbox';
import ToastMsg from '../../../../components/ToastMsg';




export function PeriodMenu({ setShowPeriodMenu }) {
  const { periodFrom, setPeriodFrom, periodTo, setPeriodTo } = useListMarks();
  const [periodFromMirror, setPeriodFromMirror] = useState(periodFrom);
  const [periodToMirror, setPeriodToMirror] = useState(periodTo);
  const [errorMsg, setErrorMsg] = useState(null);

  function handleFilterButton() {
    const toTime = periodToMirror.getTime();
    const fromTime = periodFromMirror.getTime();
    if(fromTime > toTime){
      return setErrorMsg('A data de início deve ser menor que a data de término.');
    }

    console.log((toTime - fromTime), (62 * 24 * 60 * 60 * 1000))
    const tooLong = (toTime - fromTime) > (62 * 24 * 60 * 60 * 1000);
    if(tooLong){
      return setErrorMsg('Ops... Escolha um período de até 62 dias.');
    }

    setShowPeriodMenu(false);
    setPeriodFrom(periodFromMirror);
    setPeriodTo(periodToMirror);
  }


  return (
    <>
    <FloatMenu title="Escolher período:" className="period-menu" closeMenu={setShowPeriodMenu}>
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

    {errorMsg && <ToastMsg text={errorMsg} aboveAll close={setErrorMsg} />}
    </>
  )
}


export function SettingsMenu({ setShowSettingsMenu }) {
  return (
    <FloatMenu title="O que deseja ver?" className="settings-menu" closeMenu={setShowSettingsMenu}>
      <Checkbox label="Mostrar horas extras" checked />
      <Checkbox label="Mostrar faltas" checked />
      <Checkbox label="Mostrar fins de semana e feriados trabalhados" checked />
      <button>Continuar</button>
    </FloatMenu>
  )
}



export function CommentMenu({ showComment, setShowComment }) {
  return (
    <FloatMenu title="Comentário" className="comments-menu" closeMenu={setShowComment}>
      <div>
        <p>"{showComment}"</p>
        <small>Comentado por Plinio sobre XXX no dia XX/XX/XXXX</small>
      </div>
    </FloatMenu>
  )
}