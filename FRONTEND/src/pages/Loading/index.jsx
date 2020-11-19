import React, { useEffect } from 'react';
import { useMainContext } from '../../contexts/MainContext';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../components/LoadingInner';

export default function Loading() {
  const { setUserType } = useMainContext();;
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.token;
    if (!token) return history.push('/login');

    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      const { typ } = decoded;
      setUserType(typ);

      const redirects = {
        marker: '/marks/set',
        viewer: '/list-marks',
        admin: '/dashboard'
      }

      history.push(redirects[typ]);

    } catch {
      history.push('/login')
    }

  }, [])

  return (
    <LoadingInner />
  );
}