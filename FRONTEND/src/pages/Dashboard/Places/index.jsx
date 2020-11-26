import React, { useRef, useState, useEffect } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import LoadingInner from '../../../components/LoadingInner';
import Header from '../../../components/Header';
import EmptyList from '../../../components/EmptyList';
import ToastMsg from '../../../components/ToastMsg';
import FloatMenu from '../../../components/FloatMenu';
import { FirstLetterToUpper } from '../../../utils/TextFormatters';
import { FiPlusCircle, FiEdit } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';



function validatePlaceName(name) {
  return name.length < 3 || name.length > 60;
}


export default function Places() {
  const { api, data, setData } = useMainContext();
  const newPlaceInput = useRef();
  const renamePlaceInput = useRef();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newPlaceMenu, setNewPlaceMenu] = useState(null);
  const [usersAccessesToNewPlace, setUsersAccessesToNewPlace] = useState([]);
  const [renameMenu, setRenameMenu] = useState(null);
  const [deleteMenu, setDeleteMenu] = useState(null);


  useEffect(() => {
    if (data.users) return;

    api.get('/users')
      .then(({ data }) => {
        if (data.error) return;

        setData(prev => ({ ...prev, users: data }))
      })
  }, [])




  function handleCreate() {
    const name = newPlaceInput.current.value.trim();

    if (validatePlaceName(name)) {
      setErrorMsg('O nome do local deve ter entre 3 e 60 caracteres.');
      return;
    }

    setLoading(true);

    api.post('/places', { name, 'users-accesses': usersAccessesToNewPlace })
      .then(({ data }) => {
        if (data.error) return setErrorMsg(data.error);

        setData(prev => {
          const places = [...prev.places, data];
          return { ...prev, places };
        })

        setNewPlaceMenu(false);
      })
      .catch(setErrorMsg)
      .finally(() => setLoading(false))
  }


  function handleUsersAccessesToNewPlace(e) {
    const values = Array.from(e.target.selectedOptions)
      .filter(option => option.value != 0) //eslint-disable-line
      .map(option => option.value)
      
    values.length
      ? setUsersAccessesToNewPlace(values)
      : e.target.value = '0';
  }




  function handleRename(id) {
    const name = renamePlaceInput.current.value.trim();

    if (validatePlaceName(name)) {
      setErrorMsg('O nome do local deve ter entre 3 e 60 caracteres.');
      return;
    }

    setLoading(true);

    api.put(`/places/${id}`, { name })
      .then(({ data }) => {
        if (data.error) return setErrorMsg(data.error);

        setData(prev => {
          const places = prev.places.map(place => {
            if (place.id === data.id) {
              place.name = data.name;
            }
            return place;
          })
          return { ...prev, places };
        })

        setRenameMenu(false);
      })
      .catch(setErrorMsg)
      .finally(() => setLoading(false))
  }




  function handleDelete(id) {
    setLoading(true);
    setDeleteMenu(false);

    api.delete(`/places/${id}`)
      .then(({ data }) => {
        if (data.error) {
          return setErrorMsg(data.error);
        }

        setData(prev => {
          const filtredPlaces = prev.places.filter(place => place.id != id);
          return { ...prev, places: filtredPlaces };
        })
      })
      .catch(setErrorMsg)
      .finally(() => setLoading(false))
  }



  return (
    <div id="places">

      {loading && <LoadingInner fixed />}

      <Header backButton>
        <div className="title">Locais de Trabalho</div>
        <div onClick={setNewPlaceMenu}>
          <FiPlusCircle />
        </div>
      </Header>


      <main>
        {data.places.length ? (
          data.places.map(place =>
            <section key={place.id}>
              <strong>{place.name}</strong>
              <div className="buttons">
                <button onClick={() => setRenameMenu(place)}>
                  <FiEdit />
                </button>
                <button onClick={() => setDeleteMenu(place)}>
                  <FaRegTrashAlt />
                </button>
              </div>
            </section>
          )) : (
            <EmptyList
              title="Nada por aqui..."
              text={<>Adicione locais clicando em <FiPlusCircle /> ali em cima.</>}
            />
          )}
      </main>

      {errorMsg &&
        <ToastMsg text={errorMsg} close={setErrorMsg} aboveAll />
      }

      {newPlaceMenu &&
        <FloatMenu title="Novo local" className="new-place-menu" closeMenu={setNewPlaceMenu}>
          <input
            ref={newPlaceInput}
            type="text"
            placeholder="Digite o nome do local"
            maxLength="60"
          />

          {data.users?.length > 1 &&
            <>
              <label>Quem mais terá acesso a este local?</label>
              <select
                onChange={handleUsersAccessesToNewPlace}
                defaultValue={[0]}
                multiple
                className="border"
              >
                <option value="0" hidden>Somente eu</option>
                {data.users.map(user =>
                  <option value={user.id}>{FirstLetterToUpper(user.name)}</option>
                )}
              </select>
            </>
          }
          <small>
            Após adicionar, você pode transferir funcionários para este local usando a aba Gerenciar Funcionários.
          </small>
          <button onClick={handleCreate}>Adicionar</button>
        </FloatMenu>
      }


      {renameMenu &&
        <FloatMenu title="Renomear local" className="rename-menu" closeMenu={() => setRenameMenu()}>
          <input
            ref={renamePlaceInput}
            type="text"
            placeholder={`Digite um novo nome para ${renameMenu.name}`}
            defaultValue={renameMenu.name}
          />
          <button onClick={() => handleRename(renameMenu.id)}>
            Renomear
          </button>
        </FloatMenu>
      }

      {deleteMenu &&
        <FloatMenu
          title="Apagar esse local?"
          closeMenu={() => setDeleteMenu()}
        >
          <ul>
            <li onClick={() => handleDelete(deleteMenu.id)}>
              <FaRegTrashAlt />
              Sim, quero apagar o local "{deleteMenu.name}"
            </li>
          </ul>
        </FloatMenu>
      }

    </div>
  );
}