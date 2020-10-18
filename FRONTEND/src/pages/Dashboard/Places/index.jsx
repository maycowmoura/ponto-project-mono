import React, { useState } from 'react';
import './style.scss';
import { useMainContext } from '../../../contexts/MainContext';
import Header from '../../../components/Header';
import FloatMenu from '../../../components/FloatMenu';
import { FiPlusCircle, FiEdit } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';
import EmptyList from '../../../components/EmptyList';


export default function Places() {
  const { baseurl, data: { places }, setData } = useMainContext();
  const [showNewPlaceMenu, setShowNewPlaceMenu] = useState(false);
  const [showRenameMenu, setShowRenameMenu] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);



  function handleRename() {

  }

  function handleDelete(id) {
    setData(data => {
      const filtredPlaces = data.places.filter(place => place.id != id);
      return { ...data, places: filtredPlaces };
    })

    setShowDeleteMenu(false);
  }


  return (
    <div id="places">

      <Header backButton>
        <div className="title">Locais de Trabalho</div>
        <div onClick={setShowNewPlaceMenu}>
          <FiPlusCircle />
        </div>
      </Header>


      <main>
        {places.length ? (
          places.map(place =>
            <section key={place.id}>
              <strong>{place.name}</strong>
              <div className="buttons">
                <button onClick={handleRename}>
                  <FiEdit />
                </button>
                <button onClick={() => setShowDeleteMenu(place)}>
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


      {showNewPlaceMenu &&
        <FloatMenu title="Novo Local" closeMenu={() => setShowNewPlaceMenu()}>
          <div className="new-place-menu">
            <input type="text" placeholder="Nome do novo local" />
            <small>
              Após adicionar, você pode transferir funcionários para este local usando a aba Gerenciar Funcionários.
            </small>
            <button>Adicionar</button>
          </div>
        </FloatMenu>
      }

      {showDeleteMenu &&
        <FloatMenu
          title="Tem certeza?"
          closeMenu={() => setShowDeleteMenu()}
        >
          <ul>
            <li onClick={() => handleDelete(showDeleteMenu.id)}>
              <FaRegTrashAlt />
              Apagar local "{showDeleteMenu.name}"
            </li>
          </ul>
        </FloatMenu>
      }

    </div>
  );
}