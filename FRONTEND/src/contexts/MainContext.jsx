import React, { useState } from 'react';

const MainContext = React.createContext({});

export function MainContextProvider({ children }) {
  const baseurl = process.env.NODE_ENV == 'production'
    ? './backend'
    : 'http://novoponto'
  const [data, setData] = useState(null);

  return (
    <MainContext.Provider value={{
      baseurl,
      data,
      setData
    }}>
      {children}
    </MainContext.Provider>
  )
}



export default MainContext;