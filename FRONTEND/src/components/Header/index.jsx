import React from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';



export default function Header({ backButton, children }) {
  const history = useHistory();

  return (
    <header>
      {backButton &&
        <div onClick={backButton === true ? history.goBack : backButton}>
          <FiArrowLeft />
        </div>
      }
      {children}
    </header>
  );
}