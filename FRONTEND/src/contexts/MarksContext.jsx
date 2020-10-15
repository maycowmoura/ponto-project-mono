import React, { useEffect, useState } from 'react';
import { MinutesToFormatedTime } from '../utils/TimeFormaters'

const MarksContext = React.createContext({});

export function MarksContextProvider({ children }) {
  // SET MARKS
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(null);
  const [date, setDate] = useState(new Date());
  const [formatedTime, setFormatedTime] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [comment, setComment] = useState(null);

  // LIST MARKS
  const [periodFrom, setPeriodFrom] = useState(firstDayOfMonth());
  const [periodTo, setPeriodTo] = useState(lastDayOfMonth());
  const [employers, setEmployers] = useState(false);


  useEffect(() => {
    if (!current) return;

    setFormatedTime({
      in: MinutesToFormatedTime(current.marks.time_in),
      out: MinutesToFormatedTime(current.marks.time_out)
    })
  }, [current])


  function firstDayOfMonth() {
    const time = new Date().setDate(1);
    return new Date(time);
  }

  function lastDayOfMonth() {
    const date = new Date();
    const nextMonth = date.getMonth() + 1;
    return new Date(date.getFullYear(), nextMonth, 0);
  }


  return (
    <MarksContext.Provider value={{
      setMarks: {
        index,
        setIndex,
        current,
        setCurrent,
        date,
        setDate,
        formatedTime,
        setFormatedTime,
        activeInput,
        setActiveInput,
        comment,
        setComment
      },
      listMarks: {
        periodFrom,
        setPeriodFrom,
        periodTo,
        setPeriodTo,
        employers,
        setEmployers
      }
    }}>
      { children}
    </MarksContext.Provider >
  )
}



export default MarksContext;