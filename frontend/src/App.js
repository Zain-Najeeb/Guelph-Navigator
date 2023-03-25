import React from 'react';
import './App.css';
import SearchBar from './components/wheretoBar';
function App() {
  return (
    <div className="App">
      <div className="LogoConatainor"> 
        <img src= "./images/guelphlogo.png" alt ="Logo"/> 
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
