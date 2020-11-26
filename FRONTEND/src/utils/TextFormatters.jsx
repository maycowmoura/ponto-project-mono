

export function FirstLetterToUpper(text){
  return text.toLowerCase().replace(/(^|\s)\w/g, match => match.toUpperCase());
}


export function FirstName(name){
  return name.split(' ')[0];
}


export function ReduceName(name){
  const names = name.split(' ');

  if(names.length === 1){
    return name;
  }
  
  const first = names[0];
  const last = names[names.length - 1];
  return `${first} ${last}`;
}

