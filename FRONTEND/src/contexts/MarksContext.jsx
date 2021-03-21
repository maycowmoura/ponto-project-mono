import React, { useState, useContext, useEffect } from 'react';
import { firstDayOfMonth, lastDayOfMonth } from '../utils/TimeFormaters';



const MarksContext = React.createContext({});


export function MarksContextProvider({ children }) {
  // SET MARKS
  const [dayMarks, setDayMarks] = useState(null);
  const [dayMarksBackup, setDayMarksBackup] = useState(null);
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(null);
  const [date, setDate] = useState(new Date());
  const [activeInput, setActiveInput] = useState(null);
  const [comment, setComment] = useState(null);
  const [uploadingMarks, setUploadingMarks] = useState(false);

  // LIST MARKS
  const [employers, setEmployers] = useState(null);
  const [periodFrom, setPeriodFrom] = useState(firstDayOfMonth());
  const [periodTo, setPeriodTo] = useState(lastDayOfMonth());


  useEffect(() => {
    setCurrent(dayMarks ? dayMarks[0] : null);
    setIndex(0);
  }, [dayMarks])


  return (
    <MarksContext.Provider value={{
      setMarks: {
        dayMarks,
        setDayMarks,
        dayMarksBackup,
        setDayMarksBackup,
        index,
        setIndex,
        current,
        setCurrent,
        date,
        setDate,
        activeInput,
        setActiveInput,
        comment,
        setComment,
        uploadingMarks,
        setUploadingMarks
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



export function useSetMarks() {
  const { setMarks } = useContext(MarksContext)
  return setMarks;
};

export function useListMarks() {
  const { listMarks } = useContext(MarksContext)
  return listMarks;
};