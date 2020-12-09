import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { MainContextProvider } from './contexts/MainContext';
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
import Places from './pages/Dashboard/Places';
import EmployersPage from './pages/Dashboard/EmployersPage';
import NewEmployer from './pages/Dashboard/EmployersPage/NewEmployer';
import ClosePoint from './pages/Dashboard/ClosePoint';
import PointMirror from './pages/Dashboard/PointMirror';


export default function Router({ homepage }) {
  return (
    <MainContextProvider>
      <BrowserRouter basename={homepage}>
        <Switch>
          <Route path="/" exact component={Loading} />
          <Route path="/login" exact component={Login} />
          <Route path="/login/:temp_hash" component={Login} />
          <Route path="/help" component={Help} />

          <MarksContextProvider>
            <Route path="/marks/list" component={ListMarks} />
            <Route path="/marks/set" exact component={SetMarks} />
            <Route path="/marks/set/typing" component={Typing} />
            <Route path="/marks/set/commenting" component={Commenting} />
            <Route path="/marks/set/calendar" component={Calendar} />

            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/dashboard/places" component={Places} />
            <Route path="/dashboard/employers" exact component={EmployersPage} />
            <Route path="/dashboard/employers/new" component={NewEmployer} />
            <Route path="/dashboard/close-point" component={ClosePoint} />
            <Route path="/dashboard/point-mirror" component={PointMirror} />
          </MarksContextProvider>
        </Switch>
      </BrowserRouter>
    </MainContextProvider>
  );
}
