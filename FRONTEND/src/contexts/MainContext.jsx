import React, { useState, useContext } from 'react';
import api from '../api';

const MainContext = React.createContext({});



export function MainContextProvider({ children }) {
  const [data, setData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [placeFilters, setPlaceFilters] = useState('');
  const [closedDate, setClosedDate] = useState(null);

  return (
    <MainContext.Provider value={{
      api,
      data,
      setData,
      userType, 
      setUserType,
      placeFilters,
      setPlaceFilters,
      closedDate,
      setClosedDate
    }}>
      {children}
    </MainContext.Provider>
  )
}



export function useMainContext() {
  return useContext(MainContext);
};