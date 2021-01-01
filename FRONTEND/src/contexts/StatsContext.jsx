import React, { useState, useContext, useReducer } from 'react';
import { DateToString, firstDayOfMonth, lastDayOfMonth } from '../utils/TimeFormaters';

const StatsContext = React.createContext({});


function reducerFunction(state, newValue) {
  if (newValue.reset) return {};
  return { ...state, ...newValue };
}


export function StatsContextProvider({ children }) {
  const [periodFrom, setPeriodFrom] = useState(firstDayOfMonth());
  const [periodTo, setPeriodTo] = useState(lastDayOfMonth());
  const [placeFilters, setPlaceFilters] = useState('');
  const [loadedData, setLoadedData] = useReducer(reducerFunction, {});


  return (
    <StatsContext.Provider value={{
      periodFrom,
      periodFromString: DateToString(periodFrom),
      setPeriodFrom,
      periodTo,
      periodToString: DateToString(periodTo),
      setPeriodTo,
      placeFilters,
      setPlaceFilters,
      loadedData,
      setLoadedData
    }}>
      {children}
    </StatsContext.Provider>
  )
}



export function useStatsContext() {
  return useContext(StatsContext);
};