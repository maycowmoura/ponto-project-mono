import React, { memo } from 'react';
import './style.scss';
import { MinutesToFormatedTime as format } from '../../../../../utils/TimeFormaters';
import { weekdays, months } from '../../../../../utils/MonthsAndWeekdays';
import { MdComment as Comment } from 'react-icons/md';



function DayMark({ marks, setShowComment }) {
  const keys = Object.keys(marks);
  const sameMonth = keys[0].split('-')[1] == keys[keys.length - 1].split('-')[1]; 

  return Object.entries(marks).map(([date, mark], index) => {
    const { time_in, time_out, comment, weekday, holiday, extra_before, extra_after } = mark;
    const weekendDay = weekday == 0 || weekday == 6 || holiday;
    const [, month, day] = date.split('-');
    const missed = (time_in === "missed") ? 'missed' : '';
    const weekend = (time_in && weekendDay) ? 'weekend' : '';
    const before = extra_before ? 'extra_before' : '';
    const after = extra_after ? 'extra_after' : '';


    return (
      <section
        key={date}
        className={weekendDay ? 'weekend-day' : ''}
        style={{ marginLeft: index == 0 ? `${weekday * 14.285}%` : null }}
        onClick={() => comment && setShowComment(comment)}
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
            {time_in ? format(time_in) : '---'}
          </span>
          <span className="time_out">
            {time_out ? format(time_out) : '---'}
          </span>
        </div>

        {comment && <span><Comment /></span>}
      </section>
    )
  });
}



export default memo(DayMark)