import React, { useState, useEffect } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useListMarks } from '../../../contexts/MarksContext';
import LoadingInner from '../../../components/LoadingInner';
import Header from '../../../components/Header';
import Search from '../../../components/Search';
import MainTag from '../../../components/MainTag';
import ToastMsg from '../../../components/ToastMsg';
import EmployerCard from './EmployerCard';
import { PeriodMenu, CommentMenu } from './Menus';
import { RiHistoryLine as Period } from 'react-icons/ri'
import { HiViewGrid as ViewGrid, HiSearch as SearchIcon, HiAdjustments as Settings } from 'react-icons/hi'
import { FaRegCalendarAlt as ViewCalendar } from 'react-icons/fa';


export default function ListMarks() {
  const { api, placeFilters } = useMainContext();
  const { employers, setEmployers } = useListMarks();

  const [employersMirror, setEmployersMirror] = useState(employers);
  const [loading, setLoading] = useState(false);
  const [viewGrid, setViewGrid] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [showSearch, setShowSearch] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [showComment, setShowComment] = useState(false);


  useEffect(() => {
    if (employers && sessionStorage.listMarksFilters === placeFilters) {
      return;
    }

    sessionStorage.listMarksFilters = placeFilters;

    setLoading(true);

    api.get('/employers', {
      params: { 'place-filters': placeFilters }
    }).then(({ data }) => {
      if (data.error) return setErrorMsg(data.error);
      if (!data.length) return setErrorMsg('Parece que não há funcionários nesse local.\nTransfira usando o menu Gerenciar Funcionários.');

      setEmployers(data);
      setEmployersMirror(data);
      setLoading(false);
      setShowSearch(false);
    })
      .catch(setErrorMsg)
  }, [])



  if (loading || !employers) {
    return (
      <>
        <LoadingInner text="Carregando funcionários..." />
        {errorMsg && <ToastMsg text={errorMsg} close={setErrorMsg} />}
      </>
    )
  }


  return (
    <div id="list-marks">
      <Header backButton>
        {(showSearch && employers.length > 1) &&
          <Search
            originalData={employers}
            setMirroredData={setEmployersMirror}
            keysToFilter={['name', 'job', 'place']}
            placeholder={'Pesquisar nome, função ou local'}
            closeSearch={setShowSearch}
          />
        }
        <div className="title">Marcações</div>
        {employers.length > 3 && <div onClick={setShowSearch}><SearchIcon /></div>}
        <div onClick={setShowPeriodMenu}><Period /></div>
        <div onClick={() => setViewGrid(v => !v)}>{viewGrid ? <ViewCalendar /> : <ViewGrid />}</div>
      </Header>


      <MainTag>
        {employersMirror.map((employer, key) =>
          <EmployerCard {...{ employer, setShowComment, viewGrid, key }} />
        )}
      </MainTag>


      {showPeriodMenu &&
        <PeriodMenu {...{ setShowPeriodMenu }} />
      }
      

      {showComment &&
        <CommentMenu {...{ showComment, setShowComment }} />
      }
    </div>
  );
}