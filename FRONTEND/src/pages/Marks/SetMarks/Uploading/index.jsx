import React, { useEffect, useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../../contexts/MainContext';
import { useSetMarks } from '../../../../contexts/MarksContext';
import { DateToString } from '../../../../utils/TimeFormaters';
import LoadingInner from '../../../../components/LoadingInner';
import ToastMsg from '../../../../components/ToastMsg';



export default function Uploading() {
  const { api } = useMainContext();
  const { date, dayMarks, setDayMarks, setCurrent, setIndex, setUploadingMarks } = useSetMarks();
  const [loading, setLoading] = useState(<>Enviando suas marcações.<br />Aguarde...</>);
  const [errorMsg, setErrorMsg] = useState(null);
  const stringDate = DateToString(date);


  useEffect(() => {
    const marksToUpload = dayMarks
      .filter(item => item.edited)
      .map(({ id, time_in, time_out, comment }) => ({ id, time_in, time_out, comment }));

    if (!marksToUpload.length) {
      setLoading(<>Nenhuma marcação foi alterada.<br />Retornando...</>)
      setIndex(0);
      setCurrent(dayMarks[0]);
      setTimeout(() => setUploadingMarks(false), 2000);
      return;
    }


    api.post(`/marks/${stringDate}`, marksToUpload).then(({ data }) => {
      if (data.error) {
        return setErrorMsg(data.error); 
      }

      const mappedDayMarks = dayMarks.map(mark => (
        { ...mark, edited: false, editingPrevious: true }
      ))
      setDayMarks(mappedDayMarks);
      setCurrent(mappedDayMarks[0]);
      setIndex(0);
      setLoading(<><h3>FEITO!</h3> Voltando ao início</>);
      setTimeout(setUploadingMarks, 3000);
    })
      .catch(setErrorMsg)
  }, [])
  


  return (
    <>
      <LoadingInner text={loading} />
      {errorMsg && <ToastMsg text={errorMsg} close={setUploadingMarks} />}
    </>
  )
}