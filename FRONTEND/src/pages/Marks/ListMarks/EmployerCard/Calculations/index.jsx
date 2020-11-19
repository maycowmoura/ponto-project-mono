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

  function sum(key, condition, value){
    reducer[key] += condition ? parseInt(value) : 0;
  }

  Object.values(marks).forEach(item => {
    if(!item.time_in){
      return;
    }

    const lunch_time = 60;
    
    const balance = parseInt(item.time_out) - parseInt(item.time_in) - lunch_time;
    sum('misses', item.time_in < 0, 1);
    sum('extraHours', item.time_before > 0, item.time_before);
    sum('extraHours', item.time_after > 0, item.time_after);
    sum('late', item.time_before < 0, item.time_before);
    sum('earlyExit', item.time_after < 0, item.time_after);
    sum('saturdays', (item.weekday == 6 && item.time_in), balance);
    sum('sundays', (item.weekday == 0 || !!item.holiday), balance);
  });


  return (
    <div className="calculations">
      <div className="red">
        Faltas: <span>{reducer.misses} dia(s)</span>
      </div>
      <div className="green">
        Horas Extras: <span>{format(reducer.extraHours)}</span>
      </div>
      <div className="red">
        Atraso: <span>{format(Math.abs(reducer.late))}</span>
      </div>
      <div className="green">
        Sábados: <span>{format(reducer.saturdays)}</span>
      </div>
      <div className="red">
        Saída Cedo: <span>{format(Math.abs(reducer.earlyExit))}</span>
      </div>
      <div className="green">
        Dom. e Fer.: <span>{format(reducer.sundays)}</span>
      </div>
    </div>
  )
}


export default memo(Calculations);