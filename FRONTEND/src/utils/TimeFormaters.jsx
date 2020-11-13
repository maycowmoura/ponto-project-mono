
export const addZero = num => num <= 9 ? '0' + num : String(num);


export function FormatedTimeToMinutes(formatedTime){
  let [hour, minutes] = formatedTime.replace('h', '').split(':');
  hour = Number(hour);
  minutes = Number(minutes);
  return hour * 60 + minutes;
}


export function MinutesToFormatedTime(minutes){
  const hour = addZero(parseInt(minutes / 60));
  const min = addZero(parseInt(minutes % 60));
  return `${hour}:${min}h`;
}


export function firstDayOfMonth() {
  const time = new Date().setDate(1);
  return new Date(time);
}


export function lastDayOfMonth() {
  const date = new Date();
  const nextMonth = date.getMonth() + 1;
  return new Date(date.getFullYear(), nextMonth, 0);
}


export function DateToArray(date) {
  const day = addZero(date.getDate());
  const month = addZero(date.getMonth() + 1);
  const year = date.getFullYear();
  return [year, month, day];
}



export function DateToString(date) {
  return DateToArray(date).join('-');
}


export function DateToReadable(date){
  const dateString = DateToArray(date).reverse().join('/');
  const hour = addZero(date.getHours());
  const min = addZero(date.getMinutes());
  return `em ${dateString} às ${hour}:${min}h`;
}


export function DateToDynamicReadable(date){
  const diff = new Date().getTime() - date.getTime();
  const hour = 3600000;
  const day = 24 * hour;
  if(diff < hour){
    return 'há menos de uma hora';
  } else if(diff > hour && diff < day){
    const hr = Math.round(diff / hour);
    return `há cerca de ${hr} hora${hr > 1 ? 's' : ''}`;

  } else if(diff < 7 * day){
    const dy = Math.round(diff / day);
    return `há cerca de ${dy} dia${dy > 1 ? 's' : ''}`;

  } else if (diff >= 7 * day && diff < 8 * day) {
    return 'há uma semana';

  } else {
    return DateToReadable(date);
  }
}