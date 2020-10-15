import React, { useContext } from 'react';
import './style.scss';
import MainContext from '../../../../contexts/MainContext';
import MarksContext from '../../../../contexts/MarksContext';
import { BiBlock as Block } from 'react-icons/bi';
import { FiArrowLeftCircle as Left, FiArrowRightCircle as Right } from 'react-icons/fi';
import { MdSend as Send, MdBeachAccess as Beach } from 'react-icons/md';



export default function Footer({ missed, handleMissed, setAnimationClass }) {
  const { data, setData } = useContext(MainContext);
  const { setMarks: { current, index, setIndex } } = useContext(MarksContext);



  function handleBack() {
    setIndex(prev => --prev);
    setAnimationClass('enter-left');
  }

  function handleNext() {
    const { time_in, time_out } = current.marks;
    if (time_in && (parseInt(time_in) >= parseInt(time_out))) {
      alert('Ops... O horário de saída deve ser maior que o de entrada.');
      return;
    }

    setData(prev => {
      prev.data[index] = current;
      return prev;
    });

    setIndex(prev => ++prev);
    setAnimationClass('enter-right');
  }


  return (
    <footer>
      <div
        className="progress"
        style={{ width: ((index + 1) / data.data.length * 100) + '%' }}
      />

      <button onClick={handleBack} disabled={index <= 0}>
        <Left />Anterior
      </button>
      <button className="miss" disabled={missed} onClick={() => handleMissed()}>
        <Block />Faltou
      </button>

      {index < data.data.length - 1
        ? <button onClick={handleNext}><Right />Próximo</button>
        : <button className="send"><Send />Enviar</button>
      }

    </footer>
  )
}