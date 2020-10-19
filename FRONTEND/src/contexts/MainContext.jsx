import React, { useState, useContext } from 'react';
import axios from 'axios';
const MainContext = React.createContext({});

const api = axios.create({
  baseURL: process.env.NODE_ENV == 'production'
    ? './backend'
    : 'http://novoponto'
    // : 'http://bdec0f2585e9.ngrok.io'
    // : 'http://192.168.0.107:3001'
})

export function MainContextProvider({ children }) {
  const [data, setData] = useState(null);
  const [placeFilter, setPlaceFilter] = useState('');

  return (
    <MainContext.Provider value={{
      api,
      data,
      setData,
      placeFilter, 
      setPlaceFilter
    }}>
      {children}
    </MainContext.Provider>
  )
}



export function useMainContext(){
 return useContext(MainContext);
};