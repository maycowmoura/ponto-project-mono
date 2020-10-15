
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



export const addZero = num => num <= 9 ? '0' + num : num;



export function DateToArray(date) {
  const day = addZero(date.getDate());
  const month = addZero(date.getMonth() + 1);
  const year = date.getFullYear();
  return [year, month, day];
}



export function DateToString(date) {
  return DateToArray(date).join('-');
}
