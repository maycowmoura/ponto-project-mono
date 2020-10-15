import React, { memo } from 'react';
import './style.scss';
import { MinutesToFormatedTime as format } from '../../../../../utils/TimeFormaters';



function Calculations({ marks }) {

  const reducer = {
    misses: 0,
    extraHours: 0,
    late: 0,
    earlyExit: 0,
    saturdays: 0,
    sundays: 0
  };

  const result = Object.values(marks).reduce((total, item) => {
    const balance = item.time_in ? (item.time_out - item.time_in - item.lunch_time) : 0;

    total.misses +=
      item.time_in == 'missed' ? 1 : 0;

    total.extraHours +=
      item.extra_before > 0 ? item.extra_before : 0;

    total.extraHours +=
      item.extra_after > 0 ? item.extra_after : 0;

    total.late +=
      item.extra_before < 0 ? item.extra_before : 0;

    total.earlyExit +=
      item.extra_after < 0 ? item.extra_after : 0;

    total.saturdays +=
      (item.weekday == 6 && item.time_in) ? balance : 0;

    total.sundays +=
      ((item.weekday == 0 || item.holiday) && item.time_in) ? balance : 0;

    return total;
  }, reducer);



  return (
    <div className="calculations">
      <div className="red">
        Faltas: <span>{result.misses} dia(s)</span>
      </div>
      <div className="green">
        Horas Extras: <span>{format(result.extraHours)}</span>
      </div>
      <div className="red">
        Atraso: <span>{format(Math.abs(result.late))}</span>
      </div>
      <div className="green">
        Sábados: <span>{format(result.saturdays)}</span>
      </div>
      <div className="red">
        Saída Cedo: <span>{format(Math.abs(result.earlyExit))}</span>
      </div>
      <div className="green">
        Dom. e Fer.: <span>{format(result.sundays)}</span>
      </div>
    </div>
  )
}


export default memo(Calculations);