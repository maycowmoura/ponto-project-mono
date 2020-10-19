import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../components/LoadingInner';
import { useMainContext } from '../../contexts/MainContext';

export default function Loading() {
  const { api, setData } = useMainContext();
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.token;

    // if(!token) return setRedirectTo('/login');

    const redirects = {
      marker: '/marks/set',
      viewer: '/list-marks',
      admin: '/dashboard'
    }

    api.get('/init').then(({ data }) => {
      setData(data);

      const path = redirects[data.user_type];
      history.push(path);
    })
  }, [])

  return <LoadingInner text="Inicializando..." />;
}