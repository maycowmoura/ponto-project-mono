import React, { useEffect, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useHistory } from 'react-router-dom';
import Header from '../../../components/Header';
import SelectDate from '../../../components/SelectDate';
import { FiCheck } from 'react-icons/fi';


export default function ClosePoint() {
  const { baseurl } = useMainContext();
  const history = useHistory();
  const [currentCloseDate, setCurrentCloseDate] = useState('...');


  useEffect(() => {
    fetch(`${baseurl}/close-point.json`)
      .then(r => r.json())
      .then(json => {
        const date = json.date ? json.date.split('-').reverse().join('/') : null;
        setCurrentCloseDate(date);
      })
  }, [])


  return (
    <div id="close-point">

      <Header backButton>
        <div className="title">Fechar data do ponto</div>
        <div>
          <FiCheck />
        </div>
      </Header>

      <main>
        <section>
          <h4>Selecione a Data de Fechamento:</h4>
          <SelectDate onChange={() => {}} />

        </section>
        <small>
          {currentCloseDate
            ? <>Atualmente está fechado em {currentCloseDate}.</>
            : <>Atualmente a data está aberta.</>
          }
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

    </div>
  );
}