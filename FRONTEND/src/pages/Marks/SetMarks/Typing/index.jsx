import React, { useContext, useEffect, useState, useRef } from 'react';
import './style.scss';
import MarksContext from '../../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import Input from '../Input';
import { FaBackspace, FaCheckCircle } from 'react-icons/fa';
import { FormatedTimeToMinutes } from '../../../../utils/TimeFormaters';



export default function Typing() {
  const { setMarks: { current, setCurrent, formatedTime, setFormatedTime, activeInput } } = useContext(MarksContext);
  const [inputInvalid, setInputInvalid] = useState(false);
  const history = useHistory();
  const initialValue = useRef(formatedTime[activeInput]);
  const okClicked = useRef(false);
  const timeRegex = /([0-1]\d|2[0-3]):[0-6]\dh/;


  useEffect(() => {
    handleBackspace();
    return () => okClicked.current || setTime(initialValue.current);
  }, [])


  function setTime(time) {
    setFormatedTime(prev => ({
      ...prev,
      [activeInput]: time
    }))
  }

  function handleClick(e) {
    const key = e.target.value;
    const value = formatedTime[activeInput];
    const newValue = value.replace('-', key);
    setTime(newValue);
  }

  function handleBackspace() {
    setInputInvalid(false);
    setTime('--:--h');
  }

  function handleOk() {
    setInputInvalid(false);
    const value = formatedTime[activeInput];

    if (!timeRegex.test(value)) return setInputInvalid(true);

    setCurrent(prev => {
      prev.marks[`time_${activeInput}`] = FormatedTimeToMinutes(value);
      return prev;
    })

    okClicked.current = true;
    history.goBack();
  }


  return (
    <div id="typing">
      <div className="heading">
        <h2>{current.name}</h2>
        <p>{current.job}</p>
        <Input type={activeInput} invalid={inputInvalid} />
      </div>
      <div id="keyboard">
        <button onClick={handleClick} value="1">1</button>
        <button onClick={handleClick} value="2">2</button>
        <button onClick={handleClick} value="3">3</button>
        <button onClick={handleClick} value="4">4</button>
        <button onClick={handleClick} value="5">5</button>
        <button onClick={handleClick} value="6">6</button>
        <button onClick={handleClick} value="7">7</button>
        <button onClick={handleClick} value="8">8</button>
        <button onClick={handleClick} value="9">9</button>
        <button onClick={handleBackspace}><FaBackspace /></button>
        <button onClick={handleClick} value="0">0</button>
        <button onClick={handleOk}><FaCheckCircle /></button>
      </div>
    </div>
  );
}