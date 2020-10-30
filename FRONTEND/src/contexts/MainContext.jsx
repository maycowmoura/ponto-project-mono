import React, { useState, useContext } from 'react';
import axios from 'axios';
const MainContext = React.createContext({});

const api = axios.create({
  headers: { 'Authorization': `Bearer ${localStorage.token}`},
  baseURL: process.env.NODE_ENV == 'production'
    ? '/novoponto/backend'
    : 'http://192.168.0.106:3001' // ip fixo - video pra configurar > https://youtu.be/hRB1J5NxZdE
})

export function MainContextProvider({ children }) {
  const [data, setData] = useState(null);
  const [placeFilters, setPlaceFilters] = useState('');

  return (
    <MainContext.Provider value={{
      api,
      data,
      setData,
      placeFilters, 
      setPlaceFilters
    }}>
      {children}
    </MainContext.Provider>
  )
}



export function useMainContext(){
 return useContext(MainContext);
};