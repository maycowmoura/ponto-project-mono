import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../components/LoadingInner';
import { useMainContext } from '../../contexts/MainContext';

export default function Loading() {
  const { api, setData } = useMainContext();
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState(null);



  useEffect(() => {
    const token = localStorage.token;
    if (!token) return history.push('/login');

    const redirects = {
      marker: '/marks/set',
      viewer: '/list-marks',
      admin: '/dashboard'
    }

    api.get('/init').then(({ data }) => {
      if (data.error) return history.push('/login');

      setData(data);
      history.push(redirects[data.user_type]);
    })
      .catch(() => history.push('/login'));
  }, [])

  return (
    <LoadingInner text={errorMsg || 'Inicializando...'} error={errorMsg} />
  );
}