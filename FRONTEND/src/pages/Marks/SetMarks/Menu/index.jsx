import React from 'react';
import FloatMenu from '../../../../components/FloatMenu';
import { MdViewAgenda as List, MdHelp as Help } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

export default function Menu({ close }) {
  const history = useHistory();

  return (
    <FloatMenu title="Mais opções" closeMenu={close}>
      <ul>
        <li onClick={() => history.push('/marks/list')}>
          <List /> Listar marcações
        </li>
        <li><Help /> Me ajuda</li>
      </ul>
    </FloatMenu>
  );
}
