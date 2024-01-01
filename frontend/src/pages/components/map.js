// UniversityMap.js
// To do: remove past markers (no clue how)

import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import { cords } from './../../index';
import { SearchBar } from './wheretoBar';
import { getFastestPathPoints } from '../connections.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { rooms } from './../../index';

const validBuilding = (building) => {
  return Object.keys(rooms).includes(building);
};

export function UniversityMap() {
  const [findLocation, setFindLocation] = useState('Search University of Guelph');
  const [roomNumber, setRoomNumber] = useState ('Room Number (Optional)')
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
      }
      if (searchMarker.type === "defaultDirections") {
        const response = await getFastestPathPoints(searchMarker.start, searchMarker.end);
        let route = []
        for (let i = 0; i < response.length; i++) {
          let json = {
            lng: response.route[i].lng,
            lat: response.route[i].lat
          }
          route.push(json); 
        }
        path(route); 
      }
    };
  
    fetchData();
  }, [searchMarker]);

  const path = (route) => {
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

    // Fit the map to the bounds of the route
    const bounds = route.reduce((bounds, coord) => {
      return bounds.extend([coord.lng, coord.lat]);
    }, new maptilersdk.LngLatBounds(route[0], route[0]));

    map.current.fitBounds(bounds, { padding: 20 });
  }

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
  };

  const handleDirectionsButtonClick = () => {
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
        type: "defaultDirections",
        start: "the cannon", 
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
        <div className="destination">
          <SearchBar input={findLocation} onChange={(value) => setFindLocation(value)} isRoom={false} />
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
        {validBuilding(findLocation.toLowerCase()) &&(
          <SearchBar input={roomNumber} onChange={(value) => setRoomNumber(value)} isRoom={true} building = {findLocation.toLowerCase()}/>
        )}
      </div>
    </div>
  );
}

export default UniversityMap;
