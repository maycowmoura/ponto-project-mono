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
    statType: 'breakfasts'
  }, {
    title: 'Total de almoços:',
    statType: 'lunches'
  }, {
    title: 'Total de horas extras feitas:',
    statType: 'extras-total'
  }, {
    title: 'Total de dias em que houveram horas extras:',
    statType: 'extras-worked'
  }, {
    title: 'Sábados com expediente:',
    statType: 'saturdays-worked'
  }, {
    title: 'Total de sábados pagos:',
    statType: 'saturdays-total'
  }, {
    title: 'Domingos com expediente:',
    statType: 'sundays-worked'
  }, {
    title: 'Total de domingos pagos:',
    statType: 'sundays-total'
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
        />

        <StatsCard
          title="Faltas do período:"
          statType="misses"
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