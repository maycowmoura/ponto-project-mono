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
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thisData, setThisData] = useState(loadedData[statType]?.thisData);
  const [prevData, setPrevData] = useState(loadedData[statType]?.prevData);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    // se ja foi carregado retorna não precisa fazer o request
    if (loadedData[statType]) {
      setLoading(false);
      return;
    }

    setLoading(true);

    api.get('/stats', {
      params: { from: periodFromString, to: periodToString, type: statType, 'place-filters': placeFilters }
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
  }, [loadedData[statType], reload])


  function clickToReload() {
    if (!errorMsg) return;
    setLoadedData({ [statType]: null });
    setErrorMsg(null);
    setReload(v => ++v);
  }


  const calc = (function () {
    const diff = thisData - prevData;
    return {
      diff,
      diffPercent: Math.round((thisData / prevData - 1) * 100) || 0,
      signal: diff >= 0 ? '+' : '',
      thisPercent: (thisData / (parseInt(thisData) + parseInt(prevData)) * 100) || 0,
      prevPercent: (prevData / (parseInt(thisData) + parseInt(prevData)) * 100) || 0,
      redClass: diff < 0 ? 'red' : '',
      orangeClass: diff === 0 ? 'orange' : ''
    }
  })();




  if (loading) {
    const msg = errorMsg && <>{errorMsg} <br /> Clique para tentar de novo.</>;
    return (
      <section className="stats-card loading" onClick={clickToReload}>
        <LoadingInner text={msg} />
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
          {calc.diff === 0 ? <Stopped /> : calc.diff > 0 ? <Up /> : <Down />}
          <div>
            <div className="quantity">{thisData}</div>
            <div className={`diff ${calc.redClass} ${calc.orangeClass}`}>
              {calc.signal + calc.diff} ({calc.diffPercent}%)
            </div>
          </div>
        </div>
        <div className="progress-wrapper">
          <label><Today /> Este período [{thisData}]</label>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${calc.thisPercent}%` }}></div>
          </div>
          <label><History /> Período anterior [{prevData}]</label>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${calc.prevPercent}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default memo(StatsCard);