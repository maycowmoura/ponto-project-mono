import React, { useState, useEffect, memo } from 'react';
import './style.scss';
import { useStatsContext } from '../../../../contexts/StatsContext';
import api from '../../../../api';
import LoadingInner from '../../../../components/LoadingInner';
import {
  BsArrowUp as Up,
  BsArrowDown as Down,
  BsPause as Stopped
} from 'react-icons/bs';
import { FiHelpCircle } from 'react-icons/fi';
import { IoMdCalendar as Today } from 'react-icons/io';
import { RiHistoryFill as History } from 'react-icons/ri';



function StatsCard({ title, statType }) {
  const { periodFromString, periodToString, placeFilters, loadedData, setLoadedData } = useStatsContext();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [thisData, setThisData] = useState(0);
  const [prevData, setPrevData] = useState(0);

  useEffect(() => {
    // se ja foi carregado retorna o dado carregado
    if (loadedData[statType]) {
      const { thisData, prevData } = loadedData[statType];
      setThisData(thisData);
      setPrevData(prevData);
      setLoading(false);
      return
    }

    api.get('/stats', {
      params: {
        from: periodFromString,
        to: periodToString,
        type: statType,
        'place-filters': placeFilters
      }
    })
      .then(({ data }) => {
        if (data.error) return setErrorMsg(data.error);

        const { thisData, prevData } = data[statType];
        setThisData(thisData);
        setPrevData(prevData);
        setLoading(false);
        setLoadedData({ [statType]: { thisData, prevData } })
      })
      .catch(setErrorMsg);
  }, [periodFromString, periodToString, placeFilters])


  const diff = thisData - prevData;
  const diffPercent = Math.round((thisData / prevData - 1) * 100) || 0;
  const signal = diff >= 0 ? '+' : '';
  const thisPercent = (thisData / (parseInt(thisData) + parseInt(prevData)) * 100) || 0;
  const prevPercent = (prevData / (parseInt(thisData) + parseInt(prevData)) * 100) || 0;
  const redClass = diff < 0 ? 'red' : '';
  const orangeClass = diff === 0 ? 'orange' : '';


  

  if (loading) {
    return (
      <section className="stats-card loading">
        <LoadingInner />
      </section>
    )
  }


  return (
    <section className="stats-card">
      <FiHelpCircle className="help" />
      <div className="heading">
        {title}
      </div>
      <div className="data-wrapper">
        <div className="quantity-wrapper">
          {diff === 0 ? <Stopped /> : diff > 0 ? <Up /> : <Down />}
          <div>
            <div className="quantity">{thisData}</div>
            <div className={`diff ${redClass} ${orangeClass}`}>
              {signal + diff} ({diffPercent}%)
            </div>
          </div>
        </div>
        <div className="progress-wrapper">
          <label><Today /> Este período [{thisData}]</label>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${thisPercent}%` }}></div>
          </div>
          <label><History /> Período anterior [{prevData}]</label>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${prevPercent}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default memo(StatsCard);