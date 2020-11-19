import React, { useState, useEffect } from 'react';
import './style.scss';
import { useMainContext } from '../../contexts/MainContext';
import { useParams, useHistory } from 'react-router-dom';
import LoadingInner from '../../components/LoadingInner';
import ToastMsg from '../../components/ToastMsg';
import { ImWondering } from 'react-icons/im';
import { FaRegMeh } from 'react-icons/fa';

export default function Login() {
  const { api } = useMainContext();
  const { temp_hash } = useParams();
  const history = useHistory();
  const [currentScreen, setCurrentScreen] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);



  useEffect(() => {
    if(!temp_hash){
      setCurrentScreen('notAuthenticated');
      localStorage.removeItem('token');
      return;
    }

    api.get(`/users/hash/${temp_hash}`)
      .then(({ data }) => {
        if (data.error) {
          if(localStorage.token){
            setInfoMsg('Esse link não é mais válido, mas parece que você já logou antes.\nVamos te redirecionar!');
            localStorage.removeItem('addToHomeScreen');
            setTimeout(() => history.push('/'), 7000);
            return;
          }

          return handleError(data.error);
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        localStorage.token = data.token;
        history.push('/');
      })
      .catch(handleError)
  }, [])



  function handleError(msg){
    setErrorMsg(msg);
    setCurrentScreen('error');
  }





  const screens = {
    notAuthenticated: (
      <main className="not-authenticated">
        <ImWondering />
        <h1>Você não está logado...</h1>
        <p>Solicite um acesso administrador do seu sistema.</p>
      </main>
    ),

    stillLoading: (
      <main>
        <h1>Bem vindo</h1>
        <p>Estamos carregando seu acesso...</p>
        <div>
          <LoadingInner />
        </div>
      </main>
    ),

    error: (
      <main className="error">
        <ImWondering />
        <h1>Ops...</h1>
        <p>Parece que ocorreu um erro!</p>
      </main>
    )
  }




  return (
    <div id="login">
      {screens[currentScreen ?? 'stillLoading']}

      {errorMsg && <ToastMsg text={errorMsg} />}
      {infoMsg && <ToastMsg text={infoMsg} info />}
    </div>
  );
}