import React, { useState, useEffect, useRef } from 'react';
import './style.scss';
import { useMainContext } from '../../../../contexts/MainContext';
import { useListMarks } from '../../../../contexts/MarksContext';
import FloatName from './FloatName';
import LoadingInner from '../../../../components/LoadingInner';
import Calculations from './Calculations';
import DayMark from './DayMark';
import ToastMsg from '../../../../components/ToastMsg';
import { DateToString } from '../../../../utils/TimeFormaters';
import { FaRegArrowAltCircleDown as ArrowDown, FaRegArrowAltCircleUp as ArrowUp } from 'react-icons/fa';
import { FaUser, FaSuitcase } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';


export default function EmployerCard({ employer, setShowComment, viewGrid }) {
  const { id, name, job, place } = employer;
  const { api, userType } = useMainContext();
  const card = useRef();
  const { periodFrom, periodTo } = useListMarks();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [marks, setMarks] = useState(null);



  useEffect(() => {
    setMarks(null);
    setExpanded(false);
  }, [periodFrom, periodTo])



  function handleExpand() {
    if (loading) return;
    if (marks) return setExpanded(prev => !prev);

    setLoading(true);

    api.get(`/marks/list/${id}`, {
      params: { from: DateToString(periodFrom), to: DateToString(periodTo) }
    }).then(({ data }) => {
      setMarks(data);
      setLoading(false);
      setExpanded(true);
    })
      .catch(setErrorMsg)
      .finally(() => setLoading(false))
  }


  return (
    <>
      {errorMsg && <ToastMsg text={errorMsg} close={setErrorMsg} />}

      <div ref={card} className="employer-card">
        {expanded &&
          <FloatName cardRef={card} employerName={name} />
        }

        <div className="headings">
          <div className="icon">
            <FaUser />
          </div>
          <div className="text">
            <h3>{name}</h3>
            <span><FaSuitcase /> {job}</span>
            <span><MdLocationOn /> {place}</span>
          </div>
        </div>

        <div className={`marks ${expanded ? 'expanded' : ''} ${viewGrid ? 'grid' : ''}`}>

          {marks && userType == 'admin' &&
            <Calculations marks={marks} />
          }

          <div className="weekdays">
            <span className="weekend-day">Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span className="weekend-day">Sáb</span>
          </div>

          <div className="calendar">
            {marks &&
              <DayMark marks={marks} setShowComment={setShowComment} />
            }
          </div>
        </div>

        <div className="expander" onClick={handleExpand}>
          {loading
            ? <LoadingInner loaderSize={22} loaderColor="#b4b4b4" />
            : expanded
              ? <ArrowUp />
              : <ArrowDown />
          }
        </div>
      </div>
    </>
  );
}