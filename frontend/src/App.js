import React, {useState} from 'react';
import './App.css';
import SearchBar from './components/wheretoBar';
import SquareButton from './components/squareButton';
import {locations} from './index'; 
import {getJson} from './connect/index'
const handleButtoPress = (currentLocation, findLocation) => {
  const lowerCaseCurrentLocation = currentLocation.toLowerCase();
  const lowerCaseFindLocation = findLocation.toLowerCase();

  if (findLocation === currentLocation) {
     return "same"; 
  }
  const currentLocationExists = locations.some(location => location.name.toLowerCase() === lowerCaseCurrentLocation);
  const findLocationExists = locations.some(location => location.name.toLowerCase() === lowerCaseFindLocation);

  if (currentLocationExists && findLocationExists) {
    return "valid";
  }
  if (currentLocation.trim().length === 0 || findLocation.trim().length === 0) {
    return "empty"; 
  }
  return "invalid"; 
}

function App() {
  const [currentLocation, setCurrentLocation] = useState('Current Location, (Default is the Cannon)');
  const [findLocation, setFindLocation] = useState('Find a location');
  const [showError, setShowError] = useState(false);
  const handleSearch = () => {
    const handler = handleButtoPress(currentLocation, findLocation); 
    if (handler === "valid") {
      setShowError(false);
      getJson();  
    } else {
      setShowError(true) ///needs to be changed later too lazy rn
    }
  };
  return (
    <div className="App">
      <div className="InteractionsContainor"> 
        <div className="LogoContainer"> 
          <img src={require('./images/guelphlogo.png')} alt ="Guelph-logo"/>
        </div>
        <div className="SearchBarsContainor">  
          <SearchBar input={currentLocation} onChange={(value) => setCurrentLocation(value)}  />
          <div className="Space" /> 
          <SearchBar input={findLocation} onChange={(value) => setFindLocation(value)} />
        </div>
        <div className="SquareButtonContainor">
          <SquareButton onClick={handleSearch} />
        </div>
        <div className = "ErrorMessage"> 
          {showError && <p className="ErrorText"> {currentLocation} {findLocation} </p>}
        </div>
      </div> 

    </div>
  );
}

export default App;
