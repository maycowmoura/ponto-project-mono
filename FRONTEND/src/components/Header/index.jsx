import React from 'react';
import './style.scss';
import logoImg from '../../assets/logo.png';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';



export default function Header({ backButton, logo, children }) {
  const history = useHistory();

  return (
    <header>
      {logo &&
        <div className="logo">
          <img src={logoImg} />
        </div>
      }
      {backButton &&
        <div onClick={backButton === true ? history.goBack : backButton}>
          <FiArrowLeft />
        </div>
      }
      {children}
    </header>
  );
}