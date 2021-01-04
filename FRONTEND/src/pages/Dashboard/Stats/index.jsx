import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useStatsContext } from '../../../contexts/StatsContext';
import Header from '../../../components/Header'
import MainTag from '../../../components/MainTag'
import StatsCard from './StatsCard';
import FloatMenu from '../../../components/FloatMenu'
import SelectDate from '../../../components/SelectDate'
import { MdLocationOn } from 'react-icons/md';
import { RiHistoryLine } from 'react-icons/ri';



export default function Stats() {
  const { data: { places } } = useMainContext();
  const { periodFrom, setPeriodFrom, periodTo, setPeriodTo, setPlaceFilters, setLoadedData } = useStatsContext();

  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [showPlacesMenu, setShowPlacesMenu] = useState(false);
  const [otherCards, setOtherCards] = useState([]);
  const otherCardsLength = useRef(0);
  const avaliableCards = [{
    title: 'Cafés da manhã:',
    statType: 'breakfasts',
    help: 'Esta estatística conta como 1 café da manhã o funcionário que chegou no trabalho no horário, ou com até 40min de atraso.'
  }, {
    title: 'Total de almoços:',
    statType: 'lunches',
    help: 'O total de almoços considera como 1 almoço o funcionário que chegou antes de 11:30h e saiu depois de 12:00h.'
  }, {
    title: 'Total de horas extras feitas:',
    statType: 'extras-total',
    help: 'Esta é a soma de horas extras de todos os funcionários. Ou seja, todas as horas extras que foram ou serão pagas no período.'
  }, {
    title: 'Total de dias em que houveram horas extras:',
    statType: 'extras-worked',
    help: 'Estes são em quantos dias, pelo menos um funcionário fez hora extra, seja chegando antes ou saindo após o horário.'
  }, {
    title: 'Sábados com expediente:',
    statType: 'saturdays-worked',
    help: 'Este é o total de sábados em que ao menos um funcionário trabalhou.'
  }, {
    title: 'Total de sábados pagos:',
    statType: 'saturdays-total',
    help: 'Esta é a soma de todos os sábados trabalhados por todos os funcionários. Ou seja, é o total de sábados que foram ou serão pagos.'
  }, {
    title: 'Domingos com expediente:',
    statType: 'sundays-worked',
    help: 'Este é o total de domingos em que ao menos um funcionário trabalhou.'
  }, {
    title: 'Total de domingos pagos:',
    statType: 'sundays-total',
    help: 'Esta é a soma de todos os domingos trabalhados por todos os funcionários. Ou seja, é o total de domingos que foram ou serão pagos.'
  }]
  const isAllLoaded = otherCardsLength.current === avaliableCards.length;



  useEffect(() => {
    const root = document.querySelector('#root');

    function scrollSpy() {
      const isAllLoaded = otherCardsLength.current === avaliableCards.length;
      const reachedTheBottom = (window.innerHeight + root.scrollTop) === root.scrollHeight;
      
      if (!isAllLoaded && reachedTheBottom) {
        const nextCardIndex = otherCardsLength.current;
        const nextCardProps = avaliableCards[nextCardIndex];
        const nextCard = <StatsCard {...nextCardProps} key={nextCardProps.statType} />

        setOtherCards(prev => [...prev, nextCard]);
        otherCardsLength.current++;
      }
    }

    root.addEventListener('scroll', scrollSpy);
    root.addEventListener('click', scrollSpy); // caso n tenha scroll carrega ao clicar
    return () => {
      root.removeEventListener('scroll', scrollSpy);
      root.removeEventListener('click', scrollSpy);
    }
  }, [])


  function resetComponent(){
    document.querySelector('#root').scrollTop = 0;
    setLoadedData({ reset: true });
    setOtherCards([]);
    otherCardsLength.current = 0;
    setShowPeriodMenu(false);
    setShowPlacesMenu(false);
  }


  function handlePlaceFilters(e) {
    const value = Array.from(e.target.selectedOptions)
      .filter(option => option.value != 0) //eslint-disable-line
      .map(option => option.value)
      .join();
      
    setPlaceFilters(value);
    resetComponent();
  }


  return (
    <div id="stats">
      <Header backButton>
        <div className="title">Estatísticas</div>
        {places.length > 1 && <div onClick={setShowPlacesMenu}><MdLocationOn /></div>}
        <div onClick={setShowPeriodMenu}><RiHistoryLine /></div>
      </Header>

      <MainTag>
        <div className="title">
          <h2>Estatísticas do Ponto</h2>
          <small>
            Nesta aba reunimos informações e comparações úteis
            entre o período de tempo selecionado e o período anterior.
            Assim você sempre terá os números de sua empresa na palma da mão!
          </small>
        </div>

        <StatsCard
          title="Total de dias trabalhados:"
          statType="worked-days"
          help="Esta é a soma de todos os dias trabalhados por todos os funcionários. 
          Ou seja, no fim das contas, é o total de dias que foram ou serão pagos."
        />

        <StatsCard
          title="Faltas do período:"
          statType="misses"
          help="Esta é a soma de todas as faltas de todos os funcionários no período, de acordo com seus filtros de locais, claro."
        />

        {otherCards}

        {isAllLoaded || <div className="spacer"></div>}
      </MainTag>



      {showPlacesMenu &&
        <FloatMenu
          title="Filtrar por Locais:"
          className="filter-by-place"
          closeMenu={setShowPlacesMenu}
        >
          <select
            className="border"
            multiple
            defaultValue={[0]}
            onChange={handlePlaceFilters}
          >
            <option value="0" hidden>Todos os locais</option>
            {places.map(({ id, name }) =>
              <option key={id} value={id}>{name}</option>
            )}
          </select>
        </FloatMenu>
      }

      {showPeriodMenu &&
        <FloatMenu
          title="Escolher período:"
          className="period-menu"
          closeMenu={setShowPeriodMenu}
        >
          <label>Começar em:</label>
          <SelectDate
            initialDate={periodFrom}
            onChange={setPeriodFrom}
          />

          <label>Terminar em:</label>
          <SelectDate
            initialDate={periodTo}
            onChange={setPeriodTo}
          />
          <button onClick={resetComponent}>Continuar</button>
        </FloatMenu>
      }
    </div>
  );
}