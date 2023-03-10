import React from 'react';
import './App.css';
import SearchBar from './components/wheretoBar';
function App() {
  return (
    <div className="App">
      <div className="SearchBarsContainor">  
        <SearchBar/>
        <div className="Space" /> 
        <SearchBar/>
       </div>
    </div>
  );
}

export default App;
