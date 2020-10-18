import React, { useEffect, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useSetMarks } from '../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../../components/LoadingInner';
import Uploading from './Uploading';
import Header from '../../../components/Header';
import { months, weekdays } from '../../../utils/MonthsAndWeekdays';
import { addZero, DateToString, MinutesToFormatedTime as format } from '../../../utils/TimeFormaters';
import Input from './Input';
import Footer from './Footer';
import { MdComment as Comment, MdViewAgenda as List, MdHelp as Help } from 'react-icons/md';
import { ImUserMinus as Missed } from 'react-icons/im';
import { FaRegCalendarCheck as Calendar } from 'react-icons/fa';


export default function SetMarks() {
  const { data, baseurl, placeFilter } = useMainContext();;
  const { dayMarks, setDayMarks, date, current, setCurrent, index, uploadingMarks } = useSetMarks();
  const [animationClass, setAnimationClass] = useState('enter-bottom');
  const [animateMissed, setAnimateMissed] = useState('');
  const headerDate = `${addZero(date.getDate())}/${months[date.getMonth()].short}/${date.getFullYear()}`;
  const missed = current?.mark.time_in === 'missed';
  const isAdmin = data.user_type === 'admin';
  const headerProps = isAdmin ? { backButton: true } : null;
  const history = useHistory();

  useEffect(() => {
    if (dayMarks) return;

    const stringDate = DateToString(date);
    fetch(`${baseurl}/marks/set/${stringDate}?placeFilter=${placeFilter}`)
      .then(r => r.json())
      .then(json => {
        setDayMarks(json);
        setCurrent(json[0]);
      })
  }, [date])


  useEffect(() => {
    setAnimateMissed('');
    setTimeout(() => setAnimationClass(''), 400)
  }, [index]);


  function handleMissed(revertMissed = false) {
    setAnimateMissed('animated');
    setCurrent(prev => {
      prev.mark.time_in = revertMissed ? current.default_time_in : 'missed';
      prev.mark.time_out = revertMissed ? current.default_time_out : 'missed';
      prev.edited = true;
      return { ...prev };
    })
  }

  

  function commentClick() {
    history.push('/marks/set/commenting');
  }



  if (!dayMarks || !current) {
    return <LoadingInner text="Carregando marcações..." />;
  }


  if(uploadingMarks){
    return <Uploading />
  }


  return (
    <div id="set-marks">
      <Header {...headerProps}>
        <div className="title" onClick={() => history.push('/marks/set/calendar')}>
          <Calendar />
          <span>
            <p className="weekday">{weekdays[date.getDay()].long}</p>
            <span className="bigger">{headerDate}</span>
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

          {missed ?
            <div id="missed" className={animateMissed} onClick={() => handleMissed(true)}>
              <Missed />
              <div>FALTOU</div>
            </div>
            :
            <div id="inputs" className={animateMissed}>
              <Input type="in" value={format(current.mark.time_in)} />
              <Input type="out" value={format(current.mark.time_out)} />
            </div>
          }

          <button
            className={'comment ' + (current?.mark.comment && 'has-comment')}
            onClick={commentClick}
          >
            <Comment /> {current?.mark.comment ? 'Comentado' : 'Comentar'}
          </button>
        </div>
      </main>
      <Footer
        {...{ missed, handleMissed, animationClass, setAnimationClass }}
      />
    </div>
  );
}