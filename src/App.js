import React from 'react';
import './App.css';
import routes from './routes';
import Header from './header/Header';
import Footer from './footer/Footer';

function App() {
  return (
    <div className="App">
      {Header}
      {routes}
      {Footer}
    </div>
  );
}

export default App;
