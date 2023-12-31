import React, { useState, useEffect } from 'react';
import { UniversityMap } from './../components/map';
import { SearchBar } from './../../components/wheretoBar';
import './index.css';
import { rooms } from './../../index';

const validBuilding = (building) => {
  return Object.keys(rooms).includes(building);
};

export function GuelphMap() {
  const [findLocation, setFindLocation] = useState('Search University of Guelph');
  const [roomNumber, setRoomNumber] = useState('Room number (optional)');
  const [isValidBuilding, setValidBuilding] = useState(false);

  useEffect(() => {
    const lowerCaseFindLocation = findLocation.toLowerCase();
    if (validBuilding(lowerCaseFindLocation)) {
      setValidBuilding(true);
    } else {
      setValidBuilding(false);
      setRoomNumber('Room number (optional)');
    }
  }, [findLocation]);

  return (
    <div className="wrapper">
      <div className="map-container">
        <div className="Map">
          <UniversityMap />
        </div>

        <div className="NavBars">

          <SearchBar input={findLocation} onChange={(value) => setFindLocation(value)} isRoom={false} />
          {isValidBuilding && (
            <SearchBar 
                input={roomNumber} 
                onChange={(value) => setRoomNumber(value)} 
                isRoom={isValidBuilding} 
                building={findLocation.toLocaleLowerCase()} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GuelphMap;
