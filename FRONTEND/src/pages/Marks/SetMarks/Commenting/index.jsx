import React, { useState, useEffect, useRef } from 'react';
import './style.scss';
import { useSetMarks } from '../../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import { RiRepeatFill } from 'react-icons/ri';
import { GoCheck } from 'react-icons/go';
import { FaRegTrashAlt as Trash } from 'react-icons/fa';



export default function Commenting() {
  const { current, setCurrent, setDayMarks } = useSetMarks();
  const [comment, setComment] = useState(current?.mark.comment);
  const [counter, setCounter] = useState(comment?.length || 0);
  const [repeatForAll, setRepeatForAll] = useState(false);
  const main = useRef();
  const textarea = useRef();
  const history = useHistory();


  useEffect(() => {
    textarea.current.focus();
    setTimeout(() => main.current?.classList.remove('animated'), 250)
  }, [])

  useEffect(() => {
    setCounter(comment?.length || 0);
  }, [comment])


  const suggestions = [
    'Trouxe atestado médico',
    'Passou mal',
    'Dia de Folga',
    'Feriado',
    'Transferido'
  ]


  function handleKeypress(e) {
    const el = e.target;
    const value = el.value;
    if (value.length > el.maxLength) return;

    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px'
    setComment(value);
  }


  function cursorAtTheEndOfText(e) {
    const value = e.target.value;
    e.target.value = '';
    e.target.value = value;
  }


  function handleFinish() {
    if (repeatForAll) {
      setDayMarks(prev => prev.map(item => {
        item.mark.comment = comment;
        return item;
      }))
    }

    setCurrent(prev => {
      prev.mark.comment = comment?.trim();
      prev.edited = true;
      return prev;
    })

    history.goBack();
  }


  return (
    <div ref={main} id="commenting" className="animated">
      <textarea
        ref={textarea}
        rows="5"
        placeholder="Escreva um comentário explicando esta marcação"
        maxLength="200"
        value={comment}
        onChange={handleKeypress}
        onFocus={cursorAtTheEndOfText}
      ></textarea>

      <div className="textarea-footer">
        <small>Você digitou {counter} caracteres de 200.</small>
        <span onClick={() => setComment('')}><Trash /></span>
      </div>

      <div className="suggestions">
        {suggestions.map((text, i) =>
          <button key={i} onClick={() => setComment(text)}>{text}</button>
        )}
      </div>

      <label>
        <input type="checkbox" onChange={e => setRepeatForAll(e.target.checked)} />
        <RiRepeatFill />
        <span>Repetir este comentário para todos os funcionários.</span>
      </label>

      <button className="finish" onClick={handleFinish}>
        <GoCheck /> Concluir
      </button>
    </div>
  );
}