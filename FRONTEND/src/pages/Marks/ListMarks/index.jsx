import React, { useState, useEffect } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useListMarks } from '../../../contexts/MarksContext';
import LoadingInner from '../../../components/LoadingInner';
import Header from '../../../components/Header';
import Search from './Search';
import EmployerCard from './EmployerCard';
import { PeriodMenu, CommentMenu, SettingsMenu } from './Menus';
import { RiHistoryLine as Period } from 'react-icons/ri'
import { HiViewGrid as ViewGrid, HiSearch as SearchIcon, HiAdjustments as Settings } from 'react-icons/hi'
import { FaRegCalendarAlt as ViewCalendar } from 'react-icons/fa';


export default function ListMarks() {
  const { api, placeFilters, userType } = useMainContext();
  const { employers, setEmployers } = useListMarks();

  const [employersMirror, setEmployersMirror] = useState(employers);
  const [loading, setLoading] = useState(false);
  const [viewGrid, setViewGrid] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
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
      setEmployers(data);
      setEmployersMirror(data);
      setLoading(false);
      setShowSearch(false);
    })
  }, [])



  if (loading || !employers) {
    return <LoadingInner text="Carregando funcionários..." />
  }


  return (
    <div id="list-marks">
      <Header backButton>
        {showSearch
          ? (
            <Search
              closeSearch={() => setShowSearch(false)}
              originalData={employers}
              setFiltredData={setEmployersMirror}
            />
          ) : (
            <>
              <div className="title">Marcações</div>
              <div onClick={setShowSearch}><SearchIcon /></div>
              <div onClick={setShowPeriodMenu}><Period /></div>
              <div onClick={() => setViewGrid(v => !v)}>{viewGrid ? <ViewCalendar /> : <ViewGrid />}</div>

              {userType == 'admin' &&
                <div onClick={setShowSettingsMenu}><Settings /></div>
              }
            </>
          )}
      </Header>


      <main>
        {employersMirror.map((employer, key) =>
          <EmployerCard {...{ employer, setShowComment, viewGrid, key }} />
        )}
      </main>


      {showPeriodMenu &&
        <PeriodMenu {...{ setShowPeriodMenu }} />
      }


      {showSettingsMenu &&
        <SettingsMenu {...{ setShowSettingsMenu }} />
      }


      {showComment &&
        <CommentMenu {...{ showComment, setShowComment }} />
      }
    </div>
  );
}