import React, { useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import { useHistory } from 'react-router-dom';
import Header from '../../../components/Header';
import LoadingInner from '../../../components/LoadingInner';
import EmptyList from '../../../components/EmptyList';
import ToastMsg from '../../../components/ToastMsg';
import FloatMenu from '../../../components/FloatMenu';
import { FiPlusCircle, FiEdit } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import { FaSuitcase } from 'react-icons/fa';
import { BiShuffle, BiArchive } from 'react-icons/bi';


export default function EmployersPage() {
  const { api, data: { employers, places }, setData } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [transferMenu, setTransferMenu] = useState(null);
  const [archiveMenu, setArchiveMenu] = useState(null);
  const history = useHistory();



  function handleTransferSubmit(e) {
    const employer = transferMenu;
    const destinyPlaceId = parseInt(e.target.value);
    const destinyPlaceName = e.target.selectedOptions[0].innerText.trim();
    setTransferMenu(false);

    // eslint-disable-next-line
    if (destinyPlaceId == employer.place_id) {
      return;
    }

    setLoading(true);

    api.put(`/employers/transfer/${employer.id}`, {
      place: destinyPlaceId
    })
      .then(({ data }) => {
        if (data.error) {
          return setErrorMsg(data.error);
        }

        const mappedEmployers = employers.map(empl => {
          if (empl.id === employer.id) {
            empl.place_id = destinyPlaceId;
            empl.place = destinyPlaceName;
          }
          return empl;
        })

        setData(prev => ({...prev, employers: mappedEmployers}));
      })
      .finally(() => setLoading(false))
  }


  function handleArchive(employerId) {
    setLoading(true);
    setArchiveMenu(null);

    api.delete(`/employers/${employerId}`).then(({ data }) => {
      if (data.error) return setErrorMsg(data.error);

      setData(prev => {
        const employers = prev.employers.filter(employer => employer.id !== employerId);
        return { ...prev, employers };
      })
    })
      .catch(setErrorMsg)
      .finally(() => setLoading(false))
  }



  return (
    <div id="employers-page">

      {loading && <LoadingInner fixed />}

      <Header backButton>
        <div className="title">Funcionários</div>
        <div onClick={() => history.push('/dashboard/employers/new')}>
          <FiPlusCircle />
        </div>
      </Header>


      <main>
        {employers.length ? (
          employers.map(employer =>
            <section key={employer.id}>

              <h3>{employer.name}</h3>
              <span><FaSuitcase /> {employer.job}</span>
              <span><MdLocationOn /> {employer.place}</span>

              <div className="buttons">
                <button onClick={() => setTransferMenu(employer)}>
                  <BiShuffle />
                </button>
                {/* <button>
                  <FiEdit />
                </button> */}
                <button onClick={() => setArchiveMenu(employer)}>
                  <BiArchive />
                </button>
              </div>

            </section>
          )) : (
            <EmptyList
              title="Ops..."
              text={<>Você precisa de funcionários para começar! Clique em <FiPlusCircle /> e adicione.</>}
            />
          )}
      </main>

      {errorMsg &&
        <ToastMsg text={errorMsg} close={setErrorMsg} />
      }

      {transferMenu &&
        <FloatMenu className="transfer-menu" title="Transferir funcionário" closeMenu={() => setTransferMenu()}>
          <select
            className="border"
            defaultValue=""
            onChange={handleTransferSubmit}
          >
            <option value="" hidden>Selecione o local de destino</option>
            {places.map(place => (
              <option key={place.id} value={place.id}>{place.name}</option>
            ))}
          </select>
        </FloatMenu>
      }


      {archiveMenu &&
        <FloatMenu title="Arquivar funcionário?" closeMenu={setArchiveMenu}>
          <ul>
            <li onClick={() => handleArchive(archiveMenu.id)}>
              <BiArchive />
              Sim, quero arquivar o funcionário {archiveMenu.name}
            </li>
          </ul>
        </FloatMenu>
      }
    </div>
  );
}