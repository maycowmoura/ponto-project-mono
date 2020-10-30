import React, { useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import LoadingInner from '../../../components/LoadingInner';
import Header from '../../../components/Header';
import EmptyList from '../../../components/EmptyList';
import FloatMenu from '../../../components/FloatMenu';
import { FiPlusCircle, FiEdit } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';


export default function Places() {
  const { api, data, setData } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [newPlaceMenu, setNewPlaceMenu] = useState(null);
  const [renameMenu, setRenameMenu] = useState(null);
  const [deleteMenu, setDeleteMenu] = useState(null);



  function handleRename() {

  }

  function handleDelete(id) {
    setLoading(true);
    setDeleteMenu(false);

    api.delete(`/places/${id}`)
      .then(({ data }) => {
        if(data.error){

          return;
        }
        
        setData(prev => {
          const filtredPlaces = prev.places.filter(place => place.id != id);
          return { ...prev, places: filtredPlaces };
        })
      })
      .catch(e => {
        alert(e);
      })
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


      {newPlaceMenu &&
        <FloatMenu title="Novo local" className="new-place-menu" closeMenu={() => setNewPlaceMenu()}>
          <input type="text" placeholder="Digite o nome do local" />
          <small>
            Após adicionar, você pode transferir funcionários para este local usando a aba Gerenciar Funcionários.
          </small>
          <button>Adicionar</button>
        </FloatMenu>
      }


      {renameMenu &&
        <FloatMenu title="Renomear local" className="rename-menu" closeMenu={() => setRenameMenu()}>
          <input
            type="text"
            placeholder={`Digite um novo nome para ${renameMenu.name}`}
            defaultValue={renameMenu.name}
          />
          <button>Renomear</button>
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