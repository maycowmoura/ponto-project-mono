import React, { useEffect, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../../components/LoadingInner';
import Header from '../../../components/Header';
import SelectDate from '../../../components/SelectDate';
import { DateToString } from '../../../utils/TimeFormaters';
import ToastMsg from '../../../components/ToastMsg';
import { FiCheck } from 'react-icons/fi';


export default function ClosePoint() {
  const { api, closedDate, setClosedDate } = useMainContext();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [closedDateMirror, setClosedDateMirror] = useState(closedDate || '...');
  const [dateObject, setDateObject] = useState('');


  useEffect(() => {
    if(closedDate) return;

    api.get('/closed-dates')
      .then(({ data }) => {
        const date = data.date ? data.date.split('-').reverse().join('/') : null;
        setClosedDateMirror(date);
        setClosedDate(date);
      })
  }, [])


  function initialDate(){
    const date = new Date();
    const time = date.setDate(date.getDate() - 1);
    return new Date(time);
  }



  function handleSubmit(){
    setLoading(true);
    const date = DateToString(dateObject);

    api.post('/closed-dates', { date })
      .then(({ data }) => {
        if (data.error) return setErrorMsg(data.error);
        
        setClosedDate(date.split('-').reverse().join('/'));
        history.goBack();
      })
      .catch(setErrorMsg)
      .finally(() => setLoading(false))
  }



  return (
    <div id="close-point">

      {loading && <LoadingInner fixed />}

      <Header backButton>
        <div className="title">Fechar Data do Ponto</div>
        <div onClick={handleSubmit}>
          <FiCheck />
        </div>
      </Header>

      <main>
        <section>
          <h4>Selecione a Data de Fechamento:</h4>
          <SelectDate initialDate={initialDate()} onChange={setDateObject} />

        </section>
        <small>
          <p>
            {closedDateMirror
              ? <>Atualmente está fechado em <strong>{closedDateMirror}</strong>.</>
              : <>Atualmente a data está aberta.</>
            }
          </p>
        </small>

        <small>
          <p>O Fechamento do Ponto bloqueia qualquer alteração
          das marcações daquela data para trás.</p>
          <p>Ou seja, se a data for 05 de Outubro, nenhuma marcação
          desta data ou anterior poderá ser modificada.</p>
          <p>Esta função é ideal para travar alterações depois
          que os salários já foram calculados ou pagos até
          determinada data.</p>
        </small>
      </main>

      {errorMsg &&
        <ToastMsg text={errorMsg} close={setErrorMsg} aboveAll />
      }
    </div>
  );
}