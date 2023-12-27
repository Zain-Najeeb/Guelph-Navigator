import React from 'react';
import './App.css';
import SearchBar from './components/wheretoBar';
import './images/guelphlogo.png'
function App() {
  return (
    <div className="App">
      <div className="LogoContainer"> 
      <img src={require('./images/guelphlogo.png')} alt ="Guelph-logo"/>
      </div>
      <div className="SearchBarsContainor">  
        <SearchBar input = "Current Location, (Default is the Cannon)" />
        <div className="Space" /> 
        <SearchBar input = "Find a location"/>
       </div>
    </div>
  );
}

export default App;
