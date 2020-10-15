import React, { useState, useContext, useEffect } from 'react';
import './style.scss';
import MainContext from '../../../../contexts/MainContext';
import Calculations from './Calculations';
import DayMark from './DayMark';
import { FaRegArrowAltCircleDown as ArrowDown, FaRegArrowAltCircleUp as ArrowUp } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';



export default function EmployerMark({ employer, setShowComment, viewGrid }) {
  const { name, job, marks } = employer;
  const { data: { user_type } } = useContext(MainContext);
  const [expanded, setExpanded] = useState(false);
  const [wasExpandedOnce, setWasExpandedOnce] = useState(false);

  useEffect(() => {
    if (expanded && !wasExpandedOnce) {
      setWasExpandedOnce(true);
    }
  }, [expanded])


  return (
    <div className="employer-mark">
      <div className="headings">
        <div className="icon">
          <FaUser />
        </div>
        <div className="text">
          <h3>{name}</h3>
          <p>{job}</p>
        </div>
      </div>

      <div className={`marks ${expanded ? 'expanded' : ''} ${viewGrid ? 'grid' : ''}`}>

        {user_type == 'admin' &&
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
          <DayMark marks={marks} setShowComment={setShowComment} />
        </div>
      </div>

      <div className="expander" onClick={() => setExpanded(prev => !prev)}>
        {expanded ? <ArrowUp /> : <ArrowDown />}
      </div>
    </div>
  );
}