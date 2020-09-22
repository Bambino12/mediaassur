import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import {PrivateRoute} from 'components/common';
import Login from 'pages/Login';
import Home from 'pages/Home';
import Lot from 'pages/Lot';
// import Users from 'pages/Users';
// import ClientList from 'pages/ClientList';
// import Agences from 'pages/Agences';
// import Teams from 'pages/Teams';
// import Rapport from 'pages/Rapport';
import DetailsLot from 'pages/DetailsLot';
import Importation from 'pages/Importation';
//import Sources from 'pages/hdjd';
import Parametres from 'pages/Parametres';
import Tags from 'pages/Tags';
import Accueil from 'pages/Home';


export default function Routes() {
  return (
    <Switch>
      {/* <PrivateRoute 
        component={Home}
        exact
        path="/"
      /> */}
      <PrivateRoute 
        component={Accueil}
        exact
        path="/"
      />
      
      <PrivateRoute 
        component={Parametres}
        exact
        path="/parametre"
      />
      
      <PrivateRoute 
        component={Importation}
        exact
        path="/importation"
      />
      <PrivateRoute 
        component={DetailsLot}
        exact
        path="/detailsLot"
      />
      <PrivateRoute 
        component={Lot}
        exact
        path="/liste/lot"
      />

      <Route 
        component={Login}
        exact
        path="/login"
      />
      <PrivateRoute
        component={Tags}
        exact
        path="/reporting"
      />
      <Redirect to="/" />
    </Switch>
  );
}
