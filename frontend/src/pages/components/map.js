import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export function UniversityMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const guelph = { lat: 43.53139722856412, lng: -80.22684968744309 };
  const [zoom] = useState(17);
  const initialPitch = 65; 
  maptilersdk.config.apiKey = '38tybbC1tUbWJURuEMad';

  useEffect(() => {
    if (map.current) return;
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [guelph.lng, guelph.lat],
      zoom: zoom,
      pitch: initialPitch // Set the initial pitch angle
    });

    new maptilersdk.Marker({ color: "#FF0000" })
      .setLngLat([-80.22684968744309, 43.53139722856412])
      .addTo(map.current);
  }, [guelph.lat, guelph.lng, zoom, initialPitch]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}

export default UniversityMap;
