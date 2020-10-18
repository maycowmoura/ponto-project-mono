import React, { useState, useCallback } from 'react';
import './style.scss';
import { useSetMarks } from '../../../../contexts/MarksContext';
import { addZero } from '../../../../utils/TimeFormaters';
import { months } from '../../../../utils/MonthsAndWeekdays';
import { useHistory } from 'react-router-dom';
import Header from '../../../../components/Header';
import { MdToday as Today } from 'react-icons/md';
import {
  IoIosArrowDropleftCircle as Left,
  IoIosArrowDroprightCircle as Right
} from 'react-icons/io';



export default function Calendar() {
  const { date, setDate, setIndex, setDayMarks } = useSetMarks();
  const [currentDate, setCurrentDate] = useState(date);
  const history = useHistory();
  currentDate.setDate(1);
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();



  function backMonth() {
    currentDate.setMonth(month - 1);
    setCurrentDate(new Date(currentDate));
  }


  function nextMonth() {
    currentDate.setMonth(month + 1);
    setCurrentDate(new Date(currentDate));
  }



  function handleDayClick(...value) {
    const newDate = new Date(...value);
    const today = new Date();

    if (newDate.toISOString() > today.toISOString()) {
      alert('Você não pode alterar datas futuras.');
      return;
    }

    setDate(newDate);
    setDayMarks(null); // força o reload dos dias
    setIndex(0);
    history.goBack();
  }
  
  
  function setToday() {
    setDate(new Date);
    setDayMarks(null); // força o reload dos dias
    setIndex(0);
    history.goBack();
  }



  const renderDays = useCallback(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const result = [];

    for (let day = 1; day <= lastDay; day++) {
      const weekday = new Date(year, month, day).getDay();
      const weekend = (weekday == 0 || weekday == 6) ? 'weekend' : '';
      result.push(
        <button
          key={day}
          className={`day ${weekend}`}
          style={{ marginLeft: day == 1 ? (100 / 7 * firstWeekday + '%') : '' }}
          onClick={() => handleDayClick(year, month, day)}
        >
          <span>{addZero(day)}</span>
        </button>
      )
    }

    return result;
  }, [currentDate])





  return (
    <div id="calendar">
      <Header backButton>
        <div className="title">
          Selecionar data
        </div>
        <div className="go-today" onClick={setToday}>
          <Today />
          <span>Hoje</span>
        </div>
      </Header>

      <main>
        <div className="calendar-header">
          <span onClick={backMonth}><Left /></span>
          <span>{months[month].short}/{year}</span>
          <span onClick={nextMonth}><Right /></span>
        </div>

        <div className="calendar-weekdays">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        <div className="calendar-days">
          {renderDays()}
        </div>
      </main>
    </div>
  );
}