// UniversityMap.js
import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import {cords} from './../../index'
import {SearchBar} from './../../components/wheretoBar'
export function UniversityMap() {
  const [findLocation, setFindLocation] = useState('Search University of Guelph');
  const mapContainer = useRef(null);
  const map = useRef(null);
  const guelph = { lat: 43.53139722856412, lng: -80.22684968744309 };
  const [zoom] = useState(17);
  const initialPitch = 65; 
  const [searchMarker, setSearchMarker] = useState({
    type: "none", 
    building: "none",
    name: "none"
  }); 
  maptilersdk.config.apiKey = '38tybbC1tUbWJURuEMad';

  useEffect(() => {
    if (map.current) return;
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [guelph.lng, guelph.lat],
      zoom: zoom,
      pitch: initialPitch
    });
    new maptilersdk.Marker({ color: "#FF0000" })
    .setLngLat([-80.22684968744309, 43.53139722856412])
    .addTo(map.current);
  }, [guelph.lat, guelph.lng, zoom, initialPitch]);


  useEffect (() => {
    if (searchMarker.type === "destinationUpdate") {
      console.log(searchMarker.building)
      const marker = new maptilersdk.Marker({ color: "#FF0000" })  
      .setLngLat(cords[searchMarker.building])
      .addTo(map.current);
      const popup = new maptilersdk.Popup().setText(`${searchMarker.name}`);;
      marker.setPopup(popup);
      map.current.flyTo({
        center: cords[searchMarker.building],
        zoom: 17,
        pitch: initialPitch,
      });
    }

  }, [searchMarker]); 
  return (
    <div>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
      <div className="NavBars">
        <SearchBar input={findLocation} onChange={(value) => setFindLocation(value)} onSearch = {value => setSearchMarker(value)} isRoom={false} />
      </div>
    </div>
  );
  
  
}

export default UniversityMap;
