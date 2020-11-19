import React, { memo } from 'react';
import './style.scss';
import { MinutesToFormatedTime as format } from '../../../../../utils/TimeFormaters';
import { weekdays, months } from '../../../../../utils/MonthsAndWeekdays';
import { MdComment as Comment } from 'react-icons/md';



function DayMark({ marks, setShowComment }) {
  const keys = Object.keys(marks);
  const sameMonth = keys[0].split('-')[1] == keys[keys.length - 1].split('-')[1]; 

  return Object.entries(marks).map(([date, mark], index) => {
    const { weekday, holiday } = mark;
    const weekendDay = weekday == 0 || weekday == 6 || holiday;
    const [, month, day] = date.split('-');
    const missed = (mark.time_in < 0) ? 'missed' : '';
    const weekend = (parseInt(mark.time_in) && weekendDay) ? 'weekend' : '';
    const before = parseInt(mark.time_before) ? 'time_before' : '';
    const after = parseInt(mark.time_after) ? 'time_after' : '';


    return (
      <section
        key={date}
        className={weekendDay ? 'weekend-day' : ''}
        style={{ marginLeft: index == 0 ? `${weekday * 14.285}%` : null }}
        onClick={() => mark.comment && setShowComment(mark)}
      >
        <div className={`date ${sameMonth ? 'hide-month' : ''}`}>
          <strong>
            {day}<span className="month-grid">/{month}</span>
          </strong>
          <span className="month">{months[month - 1].short}</span>
          <span className="weekday">{weekdays[weekday].short}</span>
        </div>

        <div className={`time ${missed} ${weekend} ${before} ${after}`}>
          <span className="missed">FALTA</span>
          <span className="time_in">
            {mark.time_in ? format(mark.time_in) : '---'}
          </span>
          <span className="time_out">
            {mark.time_out ? format(mark.time_out) : '---'}
          </span>
        </div>

        {mark.comment && <span><Comment /></span>}
      </section>
    )
  });
}



export default memo(DayMark)