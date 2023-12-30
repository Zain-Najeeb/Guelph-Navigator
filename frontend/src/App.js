import React, {useState} from 'react';
import './App.css';
import SearchBar from './components/wheretoBar';
import SquareButton from './components/squareButton';
function App() {
  const [currentLocation, setCurrentLocation] = useState('Current Location, (Default is the Cannon)');
  const [findLocation, setFindLocation] = useState('Find a location');
  const [showError, setShowError] = useState(false);
  const handleSearch = () => {
    if (currentLocation.trim() === '' || findLocation.trim() === '') {
      setShowError(true);
    } else {
      setShowError(false);
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
          {showError && <p className="ErrorText"> "dsfs" </p>}
        </div>
      </div> 

    </div>
  );
}

export default App;
