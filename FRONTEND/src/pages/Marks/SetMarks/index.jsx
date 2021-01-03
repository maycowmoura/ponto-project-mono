import React, { useEffect, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useSetMarks } from '../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../../components/LoadingInner';
import Uploading from './Uploading';
import Header from '../../../components/Header';
import ToastMsg from '../../../components/ToastMsg';
import VideoModal from '../../../components/VideoModal';
import Input from './Input';
import Footer from './Footer';
import Menu from './Menu';
import { months, weekdays } from '../../../utils/MonthsAndWeekdays';
import { DateToArray, DateToString, MinutesToFormatedTime as format } from '../../../utils/TimeFormaters';
import { MdComment as Comment } from 'react-icons/md';
import { ImUserMinus as Missed } from 'react-icons/im';
import { FaRegCalendarCheck as Calendar } from 'react-icons/fa';
import { BsThreeDotsVertical as MenuIcon } from 'react-icons/bs';


export default function SetMarks() {
  const { api, userType, placeFilters } = useMainContext();;
  const { dayMarks, setDayMarks, date, setDate, current, setCurrent, index, uploadingMarks } = useSetMarks();
  const [animationClass, setAnimationClass] = useState('enter-bottom');
  const [animateMissed, setAnimateMissed] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const missed = current?.time_in < 0 || (!current?.time_in && !/\d/.test(current?.default_time_in));
  const isAdmin = userType === 'admin';
  const history = useHistory();
  const formatedTimeIn = format(/\d+/.test(current?.time_in) ? current?.time_in : current?.default_time_in);
  const formatedTimeOut = format(/\d+/.test(current?.time_out) ? current?.time_out : current?.default_time_out);


  useEffect(() => {
    if (dayMarks && sessionStorage.setMarksFilters === placeFilters) {
      return;
    }
    sessionStorage.setMarksFilters = placeFilters;
    setLoading(true);

    api.get(`/marks/${DateToString(date)}`, {
      params: { 'place-filters': placeFilters }
    }).then(({ data }) => {
      if (data.error) return setErrorMsg(data.error);
      if (!data.length) return setErrorMsg('Parece que não há funcionários nesse local.\nTransfira usando o menu Gerenciar Funcionários.');

      const mapped = data.map(item => ({ ...item, editingPrevious: !!item.time_in }))
      setDayMarks(mapped);
      setCurrent(mapped[0]);
      setLoading(false);
    })
      .catch(setErrorMsg)

  }, [date])


  useEffect(() => {
    setAnimateMissed('');
    setTimeout(() => setAnimationClass(''), 400)
  }, [index]);



  function headerDate() {
    const [year, month, day] = DateToArray(date);
    return `${day}/${months[month - 1].short}/${year}`;
  }


  function handleGetBack() {
    setDate(new Date);
    history.goBack();
  }


  function handleMissed(revertMissed = false) {
    setAnimateMissed('animated');
    if (!current.default_time_in) {
      current.default_time_in = current.default_time_out = 0;
    }

    setCurrent(prev => {
      prev.time_in = revertMissed ? current.default_time_in : -1;
      prev.time_out = revertMissed ? current.default_time_out : -1;
      prev.timeEdited = true;
      return { ...prev };
    })
  }


  if (!dayMarks || !current || loading) {
    return (
      <>
        <LoadingInner text="Carregando marcações..." />
        {errorMsg && <ToastMsg text={errorMsg} close={handleGetBack} />}
      </>
    );
  }


  if (uploadingMarks) {
    return <Uploading />
  }


  return (
    <div id="set-marks">
      <Header
        backButton={isAdmin && (() => history.push('/dashboard'))}
        logo={!isAdmin}
      >
        <div className="title" onClick={() => history.push('/marks/set/calendar')}>
          <Calendar />
          <span>
            <p className="weekday">{weekdays[date.getDay()].long}</p>
            <span className="bigger">{headerDate()}</span>
          </span>
        </div>
        {isAdmin && <div onClick={setShowMenu}><MenuIcon /></div>}
      </Header>

      <VideoModal />

      <main>
        <div className={animationClass}>
          <h2>{current.name}</h2>
          <p>{current.job}</p>

          {missed
            ? (
              <div id="missed" className={animateMissed} onClick={() => handleMissed(true)}>
                <Missed />
                <div>FALTOU</div>
              </div>
            ) : (
              <div id="inputs" className={animateMissed}>
                <Input
                  type="in"
                  value={formatedTimeIn}
                  editingPreviousValue={current.editingPrevious}
                />
                <Input
                  type="out"
                  value={formatedTimeOut}
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

      {showMenu && <Menu close={setShowMenu} />}
    </div>
  );
}