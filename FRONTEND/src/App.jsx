import React, { useContext } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import './App.scss';
import MainContext, { MainContextProvider } from './contexts/MainContext';
import { MarksContextProvider } from './contexts/MarksContext';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Help from './pages/Help';
import SetMarks from './pages/Marks/SetMarks';
import Typing from './pages/Marks/SetMarks/Typing';
import Commenting from './pages/Marks/SetMarks/Commenting';
import Calendar from './pages/Marks/SetMarks/Calendar';
import ListMarks from './pages/Marks/ListMarks';
import Dashboard from './pages/Dashboard';
import ClosePoint from './pages/Dashboard/ClosePoint';

export default function App() {
  const homepage = '/novoponto';
  const { data } = useContext(MainContext);

  data || window.history.pushState(null, null, homepage);

  return (
    <MainContextProvider>
      <BrowserRouter basename={homepage}>
        <Route path="/" exact component={Loading} />
        <Route path="/login" component={Login} />
        <Route path="/help" component={Help} />

        <MarksContextProvider>
          <Route path="/marks/list" component={ListMarks} />
          <Route path="/marks/set" component={SetMarks} exact />
          <Route path="/marks/set/typing" component={Typing} />
          <Route path="/marks/set/commenting" component={Commenting} />
          <Route path="/marks/set/calendar" component={Calendar} />
        </MarksContextProvider>


        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/dashboard/close-point" component={ClosePoint} />
      </BrowserRouter>
    </MainContextProvider>
  );
}
