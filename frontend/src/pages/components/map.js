// UniversityMap.js
// To do: remove past markers (no clue how)

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import { cords } from './../../index';
import { SearchBar } from './wheretoBar';
import { getFastestPathPoints } from '../connections.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { rooms } from './../../index';
import {lowerToUpper} from './../../index'
const validBuilding = (building) => {
  return Object.keys(rooms).includes(building);
};

export function UniversityMap() {
  const [findLocation, setFindLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState ('Room Number (Optional)')
  const [sourceLocation, setSourceLocation] = useState("")
  const [destinationRequest, setDestinationRequest ] = useState(false); 
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [Error, setIsError] = useState(false);
  const [searchValue, setSearchValue] = useState("Search");
  const [directionsValue, setDirectionsValue] = useState("Directions");
  const guelph = { lat: 43.53139722856412, lng: -80.22684968744309 };
  const [zoom] = useState(17);
  const initialPitch = 65;
  const [searchMarker, setSearchMarker] = useState({
    type: "none",
    building: "none",
    name: "none",
    room: "none"
  });
  const removeAllMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };
  maptilersdk.config.apiKey = '38tybbC1tUbWJURuEMad';
  const markersRef = useRef([]);
  useEffect(() => {
    if (map.current) return;
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [guelph.lng, guelph.lat],
      zoom: zoom,
      pitch: initialPitch
    });

    const marked = new maptilersdk.Marker({ color: "#0000FF" })
      .setLngLat([-80.22684968744309, 43.53139722856412])
      .addTo(map.current);
      markersRef.current.push(marked);
  }, [guelph.lat, guelph.lng, zoom, initialPitch]);
  const path = useCallback((route, length) => {
    removeAllMarkers(); 
    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }  
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.map(coord => [coord.lng, coord.lat]),
        },
      },
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#FF0000',
        'line-width': 2,
      },
    });
    const bounds = route.reduce((bounds, coord) => {
      return bounds.extend([coord.lng, coord.lat]);
    }, new maptilersdk.LngLatBounds(route[0], route[0]));

    map.current.fitBounds(bounds, { padding: 20 });

    const end = new maptilersdk.Marker({ color: "#FF0000" })
      .setLngLat([route[length-1].lng, route[length-1].lat])
      .addTo(map.current);
    markersRef.current.push(end)
    const start = new maptilersdk.Marker({ color: "#0000FF" })
      .setLngLat([route[0].lng, route[0].lat])
      .addTo(map.current);
    markersRef.current.push(start)
  } , []);

  useEffect(() => {
    const fetchData = async () => {
      if (searchMarker.type === "destinationUpdate") {
        const marker = new maptilersdk.Marker({ color: "#FF0000" })
          .setLngLat(cords[searchMarker.building])
          .addTo(map.current);
        const popup = new maptilersdk.Popup().setText(`${searchMarker.name}`);
        marker.setPopup(popup);
        map.current.flyTo({
          center: cords[searchMarker.building],
          zoom: 17,
          pitch: initialPitch,
        });
        markersRef.current.push(marker)
      }
      if (searchMarker.type === "defaultDirections") {
        const response = await getFastestPathPoints(lowerToUpper[searchMarker.start], lowerToUpper[searchMarker.end]);
        let route = []
        for (let i = 0; i < response.length; i++) {
          let json = {
            lng: response.route[i].lng,
            lat: response.route[i].lat
          }
          route.push(json); 
        }
        path(route, response.length); 
        setDestinationRequest(true); 
      }
    };
  
    fetchData();
  }, [searchMarker, path]);
  const handleSearchButtonClick = () => {
    const lowerCaseFindLocation = findLocation.toLowerCase().trim();
    if (!validBuilding(lowerCaseFindLocation)) {
      setIsError(true);
      setSearchValue(`Can't find '${findLocation}' `);
      setDirectionsValue(`Can't find '${findLocation}' `);
    } else {
      setIsError(false);
      setSearchValue("Search");
      setDirectionsValue(`Directions`);
      setSearchMarker({
        type: "destinationUpdate",
        building: lowerCaseFindLocation,
        name: findLocation,
        room: "none"
      });
    }
  }

  const handleDirectionsButtonClick = () => {
    const lowerCaseFindLocation = findLocation.toLowerCase().trim();
    let source = "the cannon"; 
    if (destinationRequest && sourceLocation.trim().length !== 0) {
      source = sourceLocation.toLowerCase().trim();
    }
    if (!validBuilding(lowerCaseFindLocation)) {
      setIsError(true);
      setSearchValue(`Can't find '${findLocation}'`);
      setDirectionsValue(`Can't find '${findLocation}'`);
    } else if (!validBuilding(source)) {
      setIsError(true);
      setSearchValue(`Can't find '${source}'`);
      setDirectionsValue(`Can't find '${source}'`);
    } else {
      setIsError(false);
      setSearchValue("Search");
      setDirectionsValue(`Directions`);
      setSearchMarker({
        type: "defaultDirections",
        start: source, 
        end: lowerCaseFindLocation, 
        building: lowerCaseFindLocation,
        name: findLocation,
        room: "none"
      });
    }
  }

  return (
    <div>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
      <div className="NavBars">
        <div className='source'>
          {destinationRequest && (
           <SearchBar input={"Source (Default is the Cannon)"} onChange = {(value) => setSourceLocation(value)}  isRoom ={false}/>  
          )}
        </div>
        <div className="destination">
          <SearchBar input={"Search University of Guelph"} onChange={(value) => setFindLocation(value)} isRoom={false} />
          <div className="icons">
            <button className="arrow-icon"
              onClick={() => handleDirectionsButtonClick()}
              style={{
                left: "87%"
              }}
            >
              <FontAwesomeIcon icon={faArrowRight} />
              <div className="tooltip"
                style={{
                  color: Error ? "red" : "white"
                }}
              >{directionsValue}</div>
            </button>
            <button
              className="arrow-icon"
              onClick={() => handleSearchButtonClick()} >
              <FontAwesomeIcon icon={faSearch} />
              <div className="search-icon-tooltip"
                style={{
                  color: Error ? "red" : "white"
                }}
              >
                {searchValue}
              </div>
            </button>
          </div>
        </div>
        {validBuilding(findLocation.toLowerCase().trim()) &&(
          <SearchBar input={"Room Number (Optional)"} onChange={(value) => setRoomNumber(value)} isRoom={true} building = {findLocation.toLowerCase().trim()}/>
        )}
      </div>
    </div>
  );
}

export default UniversityMap;
