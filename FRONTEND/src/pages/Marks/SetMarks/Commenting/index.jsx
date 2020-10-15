import React, { useContext, useState, useEffect, useRef } from 'react';
import './style.scss';
import MainContext from '../../../../contexts/MainContext';
import MarksContext from '../../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import { RiRepeatFill } from 'react-icons/ri';
import { GoCheck } from 'react-icons/go';
import { FaRegTrashAlt as Trash } from 'react-icons/fa';



export default function Commenting() {
  const { setData } = useContext(MainContext);
  const { setMarks: { current, setCurrent } } = useContext(MarksContext);
  const [comment, setComment] = useState(current?.marks.comment);
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
      setData(prev => {
        const data = prev.data.map(item => {
          item.marks.comment = comment;
          return item;
        });

        return { ...prev, data };
      })
    }

    setCurrent(prev => {
      prev.marks.comment = comment?.trim();
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