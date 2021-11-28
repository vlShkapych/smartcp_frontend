import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";


import Registration from "./components/registration/Registration";
import CardsList from "./components/cardsList/CardsList";


import App from "./App"

export const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                
                    <Route path="/addCard" element={<Registration />} />
                    
                    <Route path="/cardsList" element={<CardsList />} />
                    <Route path="/turnstileList" element={<Registration />} />
                
            
            </Routes>
        </BrowserRouter>
    );
}
export default Router;
