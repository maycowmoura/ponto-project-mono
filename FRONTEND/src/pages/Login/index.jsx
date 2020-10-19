import React, { useRef, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { AiOutlineLoading3Quarters as LoadingIcon } from 'react-icons/ai';
import './style.scss';


export default function Login() {
  const emailInput = useRef();
  const code = useRef();

  const [redirectTo, setRedirectTo] = useState(null);
  const [validatationPage, setValidationPage] = useState(false);
  const [disableInputs, setDisableinputs] = useState(false);

  useEffect(() => {
    localStorage.token && setRedirectTo('/login');
  }, [])

  function sendEmail() {
    setDisableinputs(true);
    return setValidationPage(true);
    const email = emailInput.current.value;

  }

  function sendCode() {
    // alert('Code sent');
    setValidationPage(false);
  }

  function noCode(e) {
    e.preventDefault();
    alert('No code');
  }


  return (
    <div id="login">
      {redirectTo && <Redirect to={redirectTo} />}

      <div className={'page ' + (validatationPage || 'active')}>
        <h1>Insira seu email de acesso</h1>
        <p>Seu email foi préviamente cadastrado pelo administrador.</p>

        <fieldset disabled={disableInputs}>
          <input ref={emailInput} type="email" name="email" placeholder="Digite seu email" />
          <button onClick={sendEmail}>
            <span>Continuar</span>
            <LoadingIcon />
          </button>
        </fieldset>
      </div>

      <div className={'page ' + (validatationPage && 'active')}>
        <h1>Verifique seu email</h1>
        <p>Enviamos um código de confirmação para seu email, digite-o abaixo.</p>

        <fieldset disabled={disableInputs}>
          <input ref={code} type="tel" name="code" placeholder="Código de confirmação" />
          <button onClick={sendCode}>
            <span>Acessar</span>
            <LoadingIcon />
          </button>
        </fieldset>
        <a href="#" className="no-code" onClick={noCode}>Não recebi o código.</a>
      </div>
    </div>
  );
}