import React, { useEffect, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useSetMarks } from '../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../../components/LoadingInner';
import Uploading from './Uploading';
import Header from '../../../components/Header';
import { months, weekdays } from '../../../utils/MonthsAndWeekdays';
import { DateToArray, DateToString, MinutesToFormatedTime as format } from '../../../utils/TimeFormaters';
import Input from './Input';
import Footer from './Footer';
import { MdComment as Comment, MdViewAgenda as List, MdHelp as Help } from 'react-icons/md';
import { ImUserMinus as Missed } from 'react-icons/im';
import { FaRegCalendarCheck as Calendar } from 'react-icons/fa';


export default function SetMarks() {
  const { api, data, placeFilters } = useMainContext();;
  const { dayMarks, setDayMarks, date, current, setCurrent, index, setIndex, uploadingMarks } = useSetMarks();
  const [animationClass, setAnimationClass] = useState('enter-bottom');
  const [animateMissed, setAnimateMissed] = useState('');
  const missed = current?.time_in === 'missed';
  const isAdmin = data.user_type === 'admin';
  const headerProps = isAdmin ? { backButton: true } : null;
  const history = useHistory();


  useEffect(() => {
    if (dayMarks && sessionStorage.setMarksFilters === placeFilters){
      return;
    }
    
    sessionStorage.setMarksFilters = placeFilters;

    api.get(`/marks/${DateToString(date)}`, {
      params: { 'place-filters': placeFilters }
    }).then(({ data }) => {
      const mapped = data.map(item => ({...item, editingPrevious: !!item.time_in}))
      setDayMarks(mapped);
      setCurrent(mapped[0]);
    })
  }, [date])


  useEffect(() => {
    setAnimateMissed('');
    setTimeout(() => setAnimationClass(''), 400)
  }, [index]);


  useEffect(() => {
    const commingFromDashboard = document.referrer.includes('/dashboard');
    if (commingFromDashboard && dayMarks) {
      setIndex(0);
      setCurrent(dayMarks[0]);
    }
  }, [dayMarks]);


  function headerDate(){
    const [year, month, day] = DateToArray(date);
    return `${day}/${months[month - 1].short}/${year}`;
  }



  function handleMissed(revertMissed = false) {
    setAnimateMissed('animated');
    setCurrent(prev => {
      prev.time_in = revertMissed ? current.default_time_in : 'missed';
      prev.time_out = revertMissed ? current.default_time_out : 'missed';
      prev.edited = true;
      return { ...prev };
    })
  }


  if (!dayMarks || !current) {
    return <LoadingInner text="Carregando marcações..." />;
  }


  if (uploadingMarks) {
    return <Uploading />
  }


  return (
    <div id="set-marks">
      <Header {...headerProps}>
        <div className="title" onClick={() => history.push('/marks/set/calendar')}>
          <Calendar />
          <span>
            <p className="weekday">{weekdays[date.getDay()].long}</p>
            <span className="bigger">{headerDate()}</span>
          </span>
        </div>
        <div onClick={() => history.push('/marks/list')}>
          <List />
        </div>

        {isAdmin ||
          <div onClick={() => history.push('/help')}>
            <Help />
          </div>
        }
      </Header>

      <main>
        <div className={animationClass}>
          <h2>{current.name}</h2>
          <p>{current.job}</p>

          {missed ? (
            <div id="missed" className={animateMissed} onClick={() => handleMissed(true)}>
              <Missed />
              <div>FALTOU</div>
            </div>
          ) : (
              <div id="inputs" className={animateMissed}>
                <Input
                  type="in"
                  value={format(current.time_in || current.default_time_in)}
                  editingPreviousValue={current.editingPrevious}
                  />
                <Input
                  type="out"
                  value={format(current.time_out || current.default_time_out)}
                  editingPreviousValue={current.editingPrevious}
                />
              </div>
            )
          }

          <button
            className={'comment ' + (current?.comment && 'has-comment')}
            onClick={() => history.push('/marks/set/commenting')}
          >
            <Comment /> {current?.comment ? 'Comentado' : 'Comentar'}
          </button>
        </div>
      </main>
      <Footer
        {...{ missed, handleMissed, animationClass, setAnimationClass }}
      />
    </div>
  );
}