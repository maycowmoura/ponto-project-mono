import React, { useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../../contexts/MainContext';
import LoadingInner from '../../../../components/LoadingInner';
import Calculations from './Calculations';
import DayMark from './DayMark';
import { FaRegArrowAltCircleDown as ArrowDown, FaRegArrowAltCircleUp as ArrowUp } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { RiSuitcase3Fill } from 'react-icons/ri';
import { MdLocationOn } from 'react-icons/md';



export default function EmployerMark({ employer, setShowComment, viewGrid }) {
  const { id, name, job, place } = employer;
  const { data: { user_type }, baseurl } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [wasExpandedOnce, setWasExpandedOnce] = useState(false);
  const [marks, setMarks] = useState(null);


  function handleExpand() {
    if (marks) {
      return setExpanded(prev => !prev);
    }

    setLoading(true);

    fetch(`${baseurl}/list/${id}`)
      .then(r => r.json())
      .then(json => {
        console.log(json);
        setMarks(json);
        setLoading(false);
        setExpanded(true);
        setWasExpandedOnce(true);
      })
  }


  return (
    <div className="employer-mark">
      <div className="headings">
        <div className="icon">
          <FaUser />
        </div>
        <div className="text">
          <h3>{name}</h3>
          <span><RiSuitcase3Fill /> {job}</span>
          <span><MdLocationOn /> {place.name}</span>
        </div>
      </div>

      <div className={`marks ${expanded ? 'expanded' : ''} ${viewGrid ? 'grid' : ''}`}>

        {marks && user_type == 'admin' &&
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
  );
}