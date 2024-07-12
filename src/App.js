import React  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Header/Navbar';
import Footer from './components/Footer/Footer';
import './assets/styles/App.css';

import BacktestChart from './components/Charts/BacktestChart';


const App = () => {
  return (
      <Router>
        <div>
          <Navbar />
          <main>
            <Routes>
             
              <Route path="/" element={<BacktestChart />} />
             
              

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
};


export default App;
