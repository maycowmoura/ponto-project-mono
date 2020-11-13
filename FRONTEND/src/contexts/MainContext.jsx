import React, { useState, useContext } from 'react';
import axios from 'axios';
const MainContext = React.createContext({});


const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? '/novoponto/backend'
    : 'http://192.168.0.109:3001' // ip fixo - video pra configurar > https://youtu.be/hRB1J5NxZdE
})

api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;

api.interceptors.response.use(response => response, function (error) {
  const defaults = {
    'Network Error': 'Falha ao contatar servidor. Verifique sua internet.'
  }

  const message = defaults[error.message] ?? error.message;
  return Promise.reject(message);
});





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