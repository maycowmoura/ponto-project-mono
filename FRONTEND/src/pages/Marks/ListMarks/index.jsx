import React, { useContext, useState, useEffect } from 'react';
import './style.scss';
import MainContext from '../../../contexts/MainContext';
import MarksContext from '../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import LoadingInner from '../../../components/LoadingInner';
import Header from '../../../components/Header';
import Search from './Search';
import EmployerCard from './EmployerCard';
import { PeriodMenu, CommentMenu, SettingsMenu } from './Menus';
import { RiHistoryLine as Period } from 'react-icons/ri'
import { HiViewGrid as ViewGrid, HiSearch as SearchIcon, HiAdjustments as Settings } from 'react-icons/hi'
import { FaRegCalendarAlt as ViewCalendar } from 'react-icons/fa';


export default function ListMarks() {
  const { data, baseurl } = useContext(MainContext);
  const { listMarks: { employers, setEmployers, periodFrom, periodTo } } = useContext(MarksContext);
  const history = useHistory();
  const [employersMirror, setEmployersMirror] = useState(employers);
  const [viewGrid, setViewGrid] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showComment, setShowComment] = useState(false);


  useEffect(() => {
    fetch(`${baseurl}/marks-period.json`)
      .then(r => r.json())
      .then(json => {
        setEmployersMirror(json);
        setEmployers(json);
      });
  }, [periodFrom, periodTo]);


  if (!employers) {
    return <LoadingInner />;
  }


  function toggleView() {
    setViewGrid(prev => !prev);
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
              <div onClick={toggleView}>{viewGrid ? <ViewCalendar /> : <ViewGrid />}</div>

              {data.user_type == 'admin' &&
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