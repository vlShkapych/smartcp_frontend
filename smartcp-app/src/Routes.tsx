import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";


import Registration from "./components/registration/Registration";
import CardsList from "./components/cardsList/CardsList";
import TurnstileList from "./components/turnstileList/TurnstileList"

import App from "./App"
import TurnstileRecords from "./components/turnstileRecords/TurnstileRecords";

export const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                
                    <Route path="/addCard" element={<Registration />} />
                    
                    <Route path="/cardsList" element={<CardsList />} />
                    <Route path="/turnstileList" element={<TurnstileList />} />
                    <Route path="/turnstileRecords" element={<TurnstileRecords />} />
            
            </Routes>
        </BrowserRouter>
    );
}
export default Router;
