import React, { useState, useEffect, memo } from 'react';
import './style.scss';
import { useStatsContext } from '../../../../contexts/StatsContext';
import api from '../../../../api';
import LoadingInner from '../../../../components/LoadingInner';
import Modal from '../../../../components/Modal';
import {
  BsArrowUp as Up,
  BsArrowDown as Down,
  BsPause as Stopped
} from 'react-icons/bs';
import { FiHelpCircle } from 'react-icons/fi';
import { IoMdCalendar as Today } from 'react-icons/io';
import { RiHistoryFill as History } from 'react-icons/ri';



function StatsCard({ title, statType, help }) {
  const { periodFromString, periodToString, placeFilters, loadedData, setLoadedData } = useStatsContext();
  const [thisData, setThisData] = useState(loadedData[statType]?.thisData);
  const [prevData, setPrevData] = useState(loadedData[statType]?.prevData);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
        animateNumbers(thisData, setThisData);
        animateNumbers(prevData, setPrevData);
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



  function animateNumbers(finalValue, setState){
    const rate = Math.ceil(finalValue / 17);
    const int = setInterval(() => {
      setState(prev => {
        const value = (prev + rate) || 0;
        if (value >= finalValue) {
          clearInterval(int);
          return finalValue;
        }
        return value;
      })
    }, 30)
  }


  const calc = (function () {
    const diff = thisData - prevData;

    function handleResult(result){
      if(!result) return 0;
      else if(result === Infinity) return 100
      else return result;
    }

    return {
      diff,
      diffPercent: handleResult(Math.round((thisData / prevData - 1) * 100)),
      signal: diff >= 0 ? '+' : '',
      thisPercent: handleResult((thisData / (parseInt(thisData) + parseInt(prevData)) * 100)),
      prevPercent: handleResult((prevData / (parseInt(thisData) + parseInt(prevData)) * 100)),
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
    <>
      <section className="stats-card">
        <FiHelpCircle className="help" onClick={setShowModal} />
        <div className="heading">
          {title}
        </div>
        <div className="data-wrapper">
          <div className="quantity-wrapper">
            {calc.diff === 0 ? <Stopped /> : calc.diff > 0 ? <Up /> : <Down />}
            <div>
              <div className="quantity">{thisData}</div>
              <div className={`diff ${calc.redClass} ${calc.orangeClass}`}>
                {calc.signal + calc.diff} ({calc.signal + calc.diffPercent}%)
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
              <div className="progress-bar prev" style={{ width: `${calc.prevPercent}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {showModal &&
        <Modal close={setShowModal}>
          {help}
        </Modal>
      }
    </>
  );
}


export default memo(StatsCard);