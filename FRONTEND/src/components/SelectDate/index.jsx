import React, { useState, useEffect } from 'react';
import { addZero, DateToString, DateToArray } from '../../utils/TimeFormaters';
import './style.scss';


export default function SelectDate({ initialDate, onChange }) {
  const today = initialDate || new Date();
  const [day, setDay] = useState(addZero(today.getDate()));
  const [month, setMonth] = useState(addZero(today.getMonth() + 1));
  const [year, setYear] = useState(today.getFullYear());
  const [invalid, setInvalid] = useState(false);


  useEffect(() => {
    const date = DateToString(new Date(year, month - 1, day))
    const isValid = [year, month, day].join('-') === date;
    const newDay = parseInt(isValid ? day : 0);
    const newMonth = parseInt(isValid ? month - 1 : month);

    // pisca se a data for invalida, mas no fim usará a data correta
    if (!isValid) {
      setInvalid(true);
      setTimeout(() => setInvalid(false), 1500);
    }

    const correctDate = new Date(year, newMonth, newDay);
    let [y, m, d] = DateToArray(correctDate);

    setDay(d); setMonth(m); setYear(y);
    onChange(correctDate);
  }, [day, month, year]);



  const handleDay = (e) => setDay(e.target.value);
  const handleYear = (e) => setYear(e.target.value);

  function handleMonth(e) {
    // se o mês selecionado for no futuro, pré-supõe que está selecionando
    // um mês do ano passado, então diminui o ano
    const dt = new Date();
    const month = e.target.value;
    if (month > dt.getMonth() && year === dt.getFullYear()) setYear(dt.getFullYear() - 1);
    setMonth(month);
  }




  return (
    <div className={'select-date' + (invalid ? ' invalid' : '')}>
      <select onChange={handleDay} value={day} >
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
        <option value="06">06</option>
        <option value="07">07</option>
        <option value="08">08</option>
        <option value="09">09</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
        <option value="24">24</option>
        <option value="25">25</option>
        <option value="26">26</option>
        <option value="27">27</option>
        <option value="28">28</option>
        <option value="29">29</option>
        <option value="30">30</option>
        <option value="31">31</option>
      </select>

      <select onChange={handleMonth} value={month}>
        <option value="01">Janeiro</option>
        <option value="02">Fevereiro</option>
        <option value="03">Março</option>
        <option value="04">Abril</option>
        <option value="05">Maio</option>
        <option value="06">Junho</option>
        <option value="07">Julho</option>
        <option value="08">Agosto</option>
        <option value="09">Setembro</option>
        <option value="10">Outubro</option>
        <option value="11">Novembro</option>
        <option value="12">Dezembro</option>
      </select>

      <select onChange={handleYear} value={year}>
        <option value="2015">2015</option>
        <option value="2016">2016</option>
        <option value="2017">2017</option>
        <option value="2018">2018</option>
        <option value="2019">2019</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
        <option value="2028">2028</option>
        <option value="2029">2029</option>
        <option value="2030">2030</option>
      </select>
    </div>
  );
}