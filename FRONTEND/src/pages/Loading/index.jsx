import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../components/LoadingInner';
import MainContext from '../../contexts/MainContext';

export default function Loading() {
  const { baseurl, setData } = useContext(MainContext)
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.token;

    // if(!token) return setRedirectTo('/login');

    const redirects = {
      marker: '/marks/set',
      viewer: '/list-marks',
      admin: '/dashboard'
    }

    fetch(`${baseurl}/marks-day.json`)
      .then(r => r.json())
      .then(data => {
        setData(data);

        const path = redirects[data.user_type];
        setTimeout(() => history.push(path), 1000);
      })
  }, [])

  return <LoadingInner text="Inicializando..." />;
}