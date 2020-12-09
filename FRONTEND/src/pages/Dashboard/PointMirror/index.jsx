import React, { useState, useRef, useCallback } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import Header from '../../../components/Header';
import SwitcherInput from '../../../components/SwitcherInput';
import LoadingInner from '../../../components/LoadingInner';
import ToastMsg from '../../../components/ToastMsg';
import SelectDate from '../../../components/SelectDate';
import { DateToString, firstDayOfMonth, lastDayOfMonth } from '../../../utils/TimeFormaters';
import { LearnMore, TraditionalPoint, ExceptionPoint, GenerateModel, SameSheet, ShowBreaks, ShowExtras, ShowMisses, ShowDayoffs } from './HelpModals';
import { FiHelpCircle } from 'react-icons/fi';


export default function PointMirror() {
  const { api, data: { places }} = useMainContext();
  const main = useRef();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [periodFrom, setPeriodFrom] = useState(firstDayOfMonth());
  const [periodTo, setPeriodTo] = useState(lastDayOfMonth());
  const [placeFilters, setPlaceFilters] = useState([]);
  
  const [helpLearnMore, setHelpLearnMore] = useState(false);
  const [helpTraditional, setHelpTraditional] = useState(false);
  const [helpException, setHelpException] = useState(false);
  const [helpGenerateModel, setHelpGenerateModel] = useState(false);
  const [helpSameSheet, setHelpSameSheet] = useState(false);
  const [helpShowBreaks, setHelpShowBreaks] = useState(false);
  const [helpShowExtras, setHelpShowExtras] = useState(false);
  const [helpShowMisses, setHelpShowMisses] = useState(false);
  const [helpShowDayoffs, setHelpShowDayoffs] = useState(false);




  function handlePlaceFilters(e){
    const value = Array.from(e.target.selectedOptions)
      .filter(option => option.value != 0) //eslint-disable-line
      .map(option => option.value);
    setPlaceFilters(value);
  }


  function handleSubmit(){
    const qs = selector => main.current.querySelector(selector).checked;

    const values = {
      placeFilters,
      periodFrom: DateToString(periodFrom),
      periodTo: DateToString(periodTo),
      pointType: qs('#traditional') ? 'traditional' : 'exception',
      generateModel: qs('#generateModel'),
      sameSheet: qs('#sameSheet'),
      showBreaks: qs('#showBreaks'),
      showExtras: qs('#showExtras'),
      showMisses: qs('#showMisses'),
      showDayoffs: qs('#showDayoffs')
    }

    setLoading(true);

    api.post('/point-mirror', values)
      .then(({ data }) => {
        if (data.error) return setErrorMsg(data.error);
        
        window.open(data.url, '_blank');
      })
      .finally(() => setLoading(false))
  }
  

  const OptionItem = useCallback(function ({ label, onClick, unchecked, ...more }) {
    return (
      <label>
        <SwitcherInput
          defaultChecked={unchecked ? false : true}
          {...more}
        />
        {label}
        <FiHelpCircle onClick={e => { onClick(true); e.preventDefault(); }} />
      </label>
    )
  }, [])


  return (
    <div id="point-mirror">

      {loading && <LoadingInner fixed />}
      {errorMsg && <ToastMsg text={errorMsg} close={setErrorMsg} aboveAll />}

      <Header backButton>
        <div className="title">Gerar Espelho de Ponto</div>
      </Header>

      <main ref={main}>
        <div className="title">
          <h2>Configurações<br /> do Espelho de Ponto</h2>
          <small>
            O Espelho de Ponto é um relatório composto de duas partes,
            um relatório de apoio e um modelo para assinatura. &nbsp;
            <a href="#" onClick={e => { setHelpLearnMore(true); e.preventDefault() }}>
              Saiba mais.
            </a>
          </small>
        </div>

        <section>
          <h4>Tipo de Ponto</h4>
          <OptionItem
            label="Ponto tradicional."
            id="traditional"
            onClick={setHelpTraditional}
            type="radio"
            name="point-type"
            unchecked
          />
          <OptionItem
            label="Ponto por Exceção."
            id="exception"
            onClick={setHelpException}
            type="radio"
            name="point-type"
          />
        </section>

        <section>
          <h4>Opções do Espelho</h4>
          <OptionItem
            label="Gerar Modelo para assinatura junto com o Espelho de Ponto."
            id="generateModel"
            onClick={setHelpGenerateModel}
          />
          <OptionItem
            label="Colocar Espelho e Modelo na mesma folha, se possível."
            id="sameSheet"
            onClick={setHelpSameSheet}
          />
          <OptionItem
            label="Deixar os horários de intervalo pré-marcados."
            id="showBreaks"
            onClick={setHelpShowBreaks}
          />
        </section>


        <section>
          <h4>Faltas e Horas Extras</h4>
          <OptionItem
            label="Mostrar faltas no espelho."
            id="showMisses"
            onClick={setHelpShowMisses}
          />
          <OptionItem
            label="Mostrar horas extras."
            id="showExtras"
            onClick={setHelpShowExtras}
          />
          <OptionItem
            label="Mostrar dias de folga que foram trabalhados."
            id="showDayoffs"
            onClick={setHelpShowDayoffs}
          />
        </section>



        <section>
          <h4>Selecione o Período</h4>
          <small>Começar em:</small>
          <SelectDate
            initialDate={periodFrom}
            onChange={setPeriodFrom}
          />

          <small>Terminar em:</small>
          <SelectDate
            initialDate={periodTo}
            onChange={setPeriodTo}
          />
        </section>

        <section>
          <h4>Filtrar Locais</h4>
          <select className="border" multiple defaultValue={[0]} onChange={handlePlaceFilters}>
            <option value="0" hidden>Todos os locais</option>
            {places.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </section>

        <button onClick={handleSubmit}>Gerar Espelhos</button>
      </main>


      { helpLearnMore && <LearnMore close={setHelpLearnMore} />}
      { helpTraditional && <TraditionalPoint close={setHelpTraditional} />}
      { helpException && <ExceptionPoint close={setHelpException} />}
      { helpGenerateModel && <GenerateModel close={setHelpGenerateModel} />}
      { helpSameSheet && <SameSheet close={setHelpSameSheet} />}
      { helpShowBreaks && <ShowBreaks close={setHelpShowBreaks} />}
      { helpShowExtras && <ShowExtras close={setHelpShowExtras} />}
      { helpShowMisses && <ShowMisses close={setHelpShowMisses} />}
      { helpShowDayoffs && <ShowDayoffs close={setHelpShowDayoffs} />}
    </div>
  );
}

