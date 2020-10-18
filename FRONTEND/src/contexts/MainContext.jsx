import React, { useState, useContext } from 'react';
const MainContext = React.createContext({});

export function MainContextProvider({ children }) {
  const baseurl = process.env.NODE_ENV == 'production'
    ? './backend'
    : 'http://novoponto';
    // : 'http://ab4661efc57d.ngrok.io';
    // : 'http://192.168.0.107:3001';





  const [data, setData] = useState(null);
  const [placeFilter, setPlaceFilter] = useState('');

  return (
    <MainContext.Provider value={{
      baseurl,
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