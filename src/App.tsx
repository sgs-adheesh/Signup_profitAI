import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DataProvider } from './context/SignupContext'; 
import Signup from './components/Signup';
import Signup_Payment from './components/Signup-payment';


const App: React.FC = () => {
    
    
    return (
        
        <Router>
            <DataProvider>
                <Routes>               
                    <Route path="/signup" Component={Signup} />
                    <Route path="/signup/payment" Component={Signup_Payment} />                
                </Routes>
            </DataProvider>
        </Router>
    );
};

export default App;
