import React from 'react';
import { UniversityMap } from './../components/map';

import './index.css';


export function GuelphMap() {

//   const [roomNumber, setRoomNumber] = useState('Room number (optional)');
//   const [isValidBuilding, setValidBuilding] = useState(false);
  

  return (
    <div className="wrapper">
      <div className="map-container">
        <div className="Map">
          <UniversityMap />
        </div>
      </div>
    </div>
  );
}

export default GuelphMap;
// {isValidBuilding && (
//     <SearchBar 
//         input={roomNumber} 
//         onChange={(value) => setRoomNumber(value)} 
//         isRoom={isValidBuilding} 
//         building={findLocation.toLocaleLowerCase()} 
//     />
//   )}