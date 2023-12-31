import React, { useState } from 'react';
import { UniversityMap } from './../components/map';
import {SearchBar } from './../../components/wheretoBar'
import './index.css';
export function GuelphMap() {
    const [findLocation, setFindLocation] = useState('Search University of Guelph');
    
  return (
    <div className="wrapper">
      <div className="map-container">
        <div className = "Map">
            <UniversityMap />
        </div>
        <div className = "NavBars">
            <SearchBar input = {findLocation} onChange={(value) => setFindLocation(value)}/>
        </div>
      </div>
    </div>
  );
}

export default GuelphMap;
