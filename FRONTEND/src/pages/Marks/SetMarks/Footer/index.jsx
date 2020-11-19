import React, { useState } from 'react';
import './style.scss';
import { useSetMarks } from '../../../../contexts/MarksContext';
import ToastMsg from '../../../../components/ToastMsg';
import { BiBlock as Block } from 'react-icons/bi';
import { FiArrowLeftCircle as Left, FiArrowRightCircle as Right } from 'react-icons/fi';
import { MdSend as Send, MdBeachAccess as Beach } from 'react-icons/md';



export default function Footer({ missed, handleMissed, animationClass, setAnimationClass }) {
  const { current, setCurrent, index, setIndex, dayMarks, setDayMarks, setUploadingMarks } = useSetMarks();
  const [toast, setToast] = useState(null);


  function handleBack() {
    setCurrent(dayMarks[index - 1]);
    setIndex(index - 1);
    setAnimationClass('enter-left');
  }

  function saveMarks() {
    // se não tiver time_in (igual a null), 
    // significa que está usando o valor padrão (default_time_in)
    if (!current.time_in) {
      current.time_in = current.default_time_in;
      current.time_out = current.default_time_out;
      current.edited = true;
    }

    setDayMarks(prev => {
      prev[index] = current;
      return prev;
    });
  }

  function validateHours() {
    const { time_in, time_out } = current;
    if (time_in >= 0 && time_in >= time_out) {
      setToast('Ops... O horário de saída deve ser maior que o de entrada.');
      return false;
    }
    return true;
  }


  function handleNext() {
    if (!validateHours()) return;

    saveMarks();

    setCurrent(dayMarks[index + 1]);
    setIndex(index + 1);
    setAnimationClass('enter-right');
  }


  function handleSend() {
    if (!validateHours()) return;
    saveMarks();
    setUploadingMarks(true);
  }


  return (
    <>
      <footer className={animationClass ? 'no-touch' : ''}>
        <div
          className="progress"
          style={{ width: ((index + 1) / dayMarks.length * 100) + '%' }}
        />

        <button onClick={handleBack} disabled={index <= 0}>
          <Left />Anterior
      </button>
        <button className="miss" disabled={missed} onClick={() => handleMissed()}>
          <Block />Faltou
      </button>

        {index < dayMarks.length - 1
          ? <button onClick={handleNext}><Right />Próximo</button>
          : <button className="send" onClick={handleSend}><Send />Enviar</button>
        }

      </footer>

      {toast && <ToastMsg text={toast} close={setToast} />}
    </>
  )
}