import React, { useContext, useEffect, useState } from 'react';
import './style.scss';
import MainContext from '../../../contexts/MainContext';
import MarksContext from '../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import Header from '../../../components/Header';
import { months, weekdays } from '../../../utils/MonthsAndWeekdays';
import { addZero } from '../../../utils/TimeFormaters';
import Input from './Input';
import Footer from './Footer';
import { MdComment as Comment, MdViewAgenda as List, MdHelp as Help } from 'react-icons/md';
import { ImUserMinus as Missed } from 'react-icons/im';
import { FaRegCalendarCheck as Calendar } from 'react-icons/fa';


export default function SetMarks() {
  const { data } = useContext(MainContext);
  const { setMarks: { date, current, setCurrent, index } } = useContext(MarksContext);
  const [animationClass, setAnimationClass] = useState('enter-bottom');
  const [animateMissed, setAnimateMissed] = useState('');
  const headerDate = `${addZero(date.getDate())}/${months[date.getMonth()].short}/${date.getFullYear()}`;
  const missed = data.data[index].marks.time_in == null;
  const isAdmin = data.user_type === 'admin';
  const history = useHistory();


  useEffect(() => {
    setCurrent(data.data[index]);
    setAnimateMissed('');
    setTimeout(() => setAnimationClass(''), 400)
  }, [index]);


  function handleMissed(revertMissed = false) {
    const defaultIn = 420; ///////////////COLOCAR HORARIO PADRÃO DO DIA
    const defaultOut = 1020;
    setAnimateMissed('animated');

    setCurrent(prev => {
      const result = { ...prev };
      result.marks.time_in = revertMissed ? defaultIn : null;
      result.marks.time_out = revertMissed ? defaultOut : null;
      return result;
    })
  }

  function commentClick() {
    history.push('/marks/set/commenting');
  }



  return (
    <div id="set-marks">
      <Header backButton>
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
          <h2>{current?.name}</h2>
          <p>{current?.job}</p>

          {missed ?
            <div id="missed" className={animateMissed} onClick={() => handleMissed(true)}>
              <Missed />
              <div>FALTOU</div>
            </div>
            :
            <div id="inputs" className={animateMissed}>
              <Input type="in" />
              <Input type="out" />
            </div>
          }

          <button
            className={'comment ' + (current?.marks.comment && 'has-comment')}
            onClick={commentClick}
          >
            <Comment /> {current?.marks.comment ? 'Comentado' : 'Comentar'}
          </button>
        </div>
      </main>
      <Footer
        {...{ missed, handleMissed, setAnimationClass }}
      />
    </div>
  );
}