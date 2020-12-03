import React, { useEffect, useState, useRef } from 'react';
import './style.scss';
import { useSetMarks } from '../../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import Input from '../Input';
import { FaBackspace, FaCheckCircle } from 'react-icons/fa';
import { FormatedTimeToMinutes, MinutesToFormatedTime } from '../../../../utils/TimeFormaters';



export default function Typing() {
  const { current, setCurrent, activeInput } = useSetMarks();
  const [value, setValue] = useState(MinutesToFormatedTime(current[`time_${activeInput}`]));
  const initialCurrent = useRef(current);
  const [inputInvalid, setInputInvalid] = useState(false);
  const history = useHistory();
  const okClicked = useRef(false);
  const inputTimeRegex = /([0-1][\d-]|2[0-3-]):[0-6-][\d-]h/;
  const finalTimeRegex = /([0-1]\d|2[0-3]):[0-6]\dh/;


  useEffect(() => {
    handleBackspace();
    window.onbeforeunload = function () { return false };
    return () => okClicked.current || setCurrent(initialCurrent.current);
  }, [])


  function handleClick(e) {
    const key = e.target.value;
    setValue(prev => prev.replace('-', key));
  }

  function handleBackspace() {
    setInputInvalid(false);
    setValue('--:--h');
  }

  function handleOk() {
    setInputInvalid(false);

    if (!finalTimeRegex.test(value)) return setInputInvalid(true);

    setCurrent(prev => {
      prev[`time_${activeInput}`] = FormatedTimeToMinutes(value);
      prev.edited = true;
      return { ...prev };
    })

    okClicked.current = true;
    history.goBack();
  }


  return (
    <div id="typing">
      <div className="heading">
        <h2>{current.name}</h2>
        <p>{current.job}</p>
        <Input type={activeInput} invalid={inputInvalid} value={value} />
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