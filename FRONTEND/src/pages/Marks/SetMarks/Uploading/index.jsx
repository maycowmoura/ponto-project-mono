import React, { useEffect, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../../contexts/MainContext';
import { useSetMarks } from '../../../../contexts/MarksContext';
import { useHistory } from 'react-router-dom';
import { DateToString } from '../../../../utils/TimeFormaters';
import LoadingInner from '../../../../components/LoadingInner';



export default function Uploading() {
  const { api } = useMainContext();
  const { date, dayMarks, setDayMarks, setCurrent, setIndex, setUploadingMarks } = useSetMarks();
  const [loadingText, setLoadingText] = useState(<>Enviando suas marcações.<br />Aguarde...</>);
  const history = useHistory();
  const stringDate = DateToString(date);



  useEffect(() => {
    const marksToUpload = dayMarks
      .filter(item => item.edited)
      .map(({ id, mark }) => ({ id, mark }));


    if (!marksToUpload.length) {
      setLoadingText(<>Nenhuma marcação foi alterada.<br />Retornando...</>)
      setIndex(0);
      setCurrent(dayMarks[0]);
      setTimeout(() => setUploadingMarks(false), 2000);
      return;
    }


    api.put(`/marks/set/${stringDate}`, marksToUpload).then(({ data }) => {
      if (data.error) {
        alert('deu erro');
        return;
      }

      setDayMarks(data);
      setCurrent(data[0]);
      setUploadingMarks(false);
    })
  }, [])


  return <LoadingInner text={loadingText} />
}