import React from 'react';

import './App.css';
import {Navigation} from './components/NavBar'
import Router  from './Routes'
import Registration from "./components/registration/Registration";
import useToken from './components/useToken'
import Login from './components/Login'

function App() {
  
  const { token, removeToken, setToken } = useToken();

  return (
    <>
      <Navigation isAuthed ={!(!token && token!=="" &&token!== undefined)} onSignOut={removeToken}></Navigation>
       {!token && token!=="" &&token!== undefined?  
        <Login setToken= {setToken} />
        :(
          <>
           <Router/>
          </>
        )}
     
    </>
  );
}

export default App;
