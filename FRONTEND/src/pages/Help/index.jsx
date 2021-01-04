import React, { useState } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import Header from '../../components/Header';
import LoadingInner from '../../components/LoadingInner';
import ToastMsg from '../../components/ToastMsg';
import { MdHelpOutline as HelpBigIcon } from 'react-icons/md';

export default function Help() {
  const history = useHistory();
  const [placeholder, setPlaceholder] = useState('Como podemos ajudar você?');
  const [reason, setReason] = useState(0);
  const [description, setDescription] = useState('');
  const [chars, setChars] = useState(500);
  const [disableTextArea, setDisableTextArea] = useState(true);
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');


  function handleSelect(e) {
    const value = e.target.value;
    const holders = {
      question: 'Explique sua dúvida com calma para que possamos te ajudar.',
      issue: 'Isso é importante! Descreva detalhadamente qual é o problema e exatamente como ele aconteceu.',
      suggestion: 'Queremos sempre melhorar! Qual a sua sugestão?'
    }
    holders[value] && setPlaceholder(holders[value]);
    setDisableTextArea(!value);
    setReason(value);
  }

  function handleTextarea(e) {
    const value = e.target.value;
    setDescription(value);
    setChars(500 - value.length);
    setDisableButton(value.trim().length < 20);
  }

  function handleSubmit() {
    setLoading(true);

    api.post('/help', { reason, description })
      .then(({ data }) => {
        if (data.error) return setErrorMsg(data.error);

        setLoadingText(<>Mensagem enviada!!<br />Obrigado!</>);
        setTimeout(history.goBack, 5000);
      })
      .catch(msg => {
        setErrorMsg(msg);
        setLoading(false);
      })
  }




  return (
    <div id="help">
      {errorMsg && <ToastMsg text={errorMsg} />}
      {loading && <LoadingInner text={loadingText} fixed />}

      <Header backButton>
        <div className="title">Me Ajuda</div>
      </Header>

      <main>
        <div className="title">
          <HelpBigIcon />
          <h2>Como podemos te ajudar?</h2>
          <small>
            Escreva abaixo, com porque você precisa de ajuda
            com <strong>máximo de detalhes</strong> que puder.
          </small>
        </div>

        <div>
          <select className="border" value={reason} onChange={handleSelect}>
            <option hidden value="0">Qual o motivo do contato?</option>
            <option value="question">Estou com uma dúvida</option>
            <option value="issue">Quero relatar um problema</option>
            <option value="suggestion">Tenho uma sugestão de melhoria</option>
          </select>

          <textarea
            rows="6"
            placeholder={placeholder}
            value={description}
            onChange={handleTextarea}
            maxLength="500"
            disabled={disableTextArea}
          ></textarea>
          <small>Restam {chars} caracteres.</small>

          <button onClick={handleSubmit} disabled={disableButton}>Enviar</button>
        </div>
      </main>
    </div >
  );
}

