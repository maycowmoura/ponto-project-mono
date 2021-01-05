import React, { useState, useRef } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import Header from '../../components/Header';
import LoadingInner from '../../components/LoadingInner';
import ToastMsg from '../../components/ToastMsg';
import { MdHelpOutline as HelpBigIcon } from 'react-icons/md';

export default function Help() {
  const history = useHistory();
  const textarea = useRef();
  const [placeholder, setPlaceholder] = useState('Como podemos ajudar você?');
  const [reason, setReason] = useState(0);
  const [description, setDescription] = useState('');
  const [chars, setChars] = useState(500);
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
    setReason(value);
    textarea.current.disabled = !value;
    textarea.current.focus();
  }

  function handleTextarea(e) {
    const maxLength = 500;
    const value = e.target.value;
    if(value >= maxLength) return;

    setDescription(value);
    setChars(maxLength - value.length);
  }

  function handleSubmit() {
    if(description.trim().length < 20) return setErrorMsg('Escreva um pouco mais...');

    setLoading(true);

    api.post('/help', { reason, description: description.trim() })
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
      {errorMsg && <ToastMsg text={errorMsg} close={setErrorMsg} />}
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
            ref={textarea}
            rows="7"
            placeholder={placeholder}
            value={description}
            onChange={handleTextarea}
            maxLength="500"
            disabled
          ></textarea>
          <small>Restam {chars} caracteres.</small>

          <button onClick={handleSubmit}>Enviar</button>
        </div>
      </main>
    </div >
  );
}

