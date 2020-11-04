import React, { useRef, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../../contexts/MainContext';
import { useHistory } from 'react-router-dom';
import Header from '../../../../components/Header';
import ToastMsg from '../../../../components/ToastMsg';
import LoadingInner from '../../../../components/LoadingInner';


export default function EmployersPage() {
  const { api, data: { employers, places }, setData } = useMainContext();
  const nameInput = useRef();
  const jobInput = useRef();
  const placeInput = useRef();
  const history = useHistory();

  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);


  function handleSubmit() {
    setErrorMsg(null);
    const name = nameInput.current.value.trim();
    const job = jobInput.current.value.trim();
    const place = placeInput.current.value.trim();

    if (!/^[A-Za-zÀ-ÿ\s]{3,60}$/.test(name)) {
      return setErrorMsg('O nome deve conter entre 3 e 60 dígitos, apenas com letras.')
    }

    if (!/^[A-zÀ-ú\s-()\d\.\\\/]{3,60}$/.test(job)) {
      return setErrorMsg('A função deve conter entre 3 e 60 dígitos, pode conter letras, números e . - ( ) / \\ [ ]');
    }

    if (!place) {
      return setErrorMsg('Por favor, selecione um local.')
    }

    setLoading(true);

    api.post('/employers', { name, job, place }).then(({ data }) => {
      if (data.error) return setErrorMsg(data.error);

      const newEmployers = [...employers, data];
      setData(prev => (
        { ...prev, employers: newEmployers }
      ))
      setLoading(false);
      history.goBack();

      setTimeout(() => { // quando voltar pros employers, scrolla pra baixo pra mostrar o novo employer
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth'});
      }, 1000)
    })
      .catch(setErrorMsg)
      .finally(() => setLoading(false))
  }


  return (
    <div id="new-employer">

      {errorMsg && <ToastMsg text={errorMsg} close={setErrorMsg} />}
      {loading && <LoadingInner fixed />}

      <Header backButton>
        <div className="title">Novo Funcionário</div>
      </Header>

      <main>
        <h2>Adicionar Novo Funcionário</h2>

        <input
          ref={nameInput}
          type="text"
          placeholder="Nome do funcionário"
          maxLength="60"
        />
        <input
          ref={jobInput}
          type="text"
          placeholder="Função"
          maxLength="60"
        />

        <select ref={placeInput} className="border">
          <option value="" hidden selected>Selecione um local</option>
          {places.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <button onClick={handleSubmit}>
          Salvar
        </button>

      </main>

    </div>
  );
}