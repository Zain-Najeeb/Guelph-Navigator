import React, { useState, useRef, useEffect } from "react";
import './wheretoBar.css';

import { locations } from './../index';
import { rooms } from './../index'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
const validBuilding = (building) => {
  return Object.keys(rooms).includes(building);
};

const MAX_RESULTS = 6;

export const SearchBar = ({ input, onChange, isRoom, building }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [Error, setIsError] = useState(false); 
  const [searchValue, setSearchValue] = useState ("Search");
  const [directionsValue, setDirectionsValue] = useState ("Directions"); 
  const inputWidth = isRoom ? 200 : 300;
  const points = isRoom ? rooms[building] : locations
  const searchContainerRef = useRef();
  
  const handleSearchButtonClick = () => {
    const lowerCaseFindLocation = searchInput.toLowerCase();
    if (!validBuilding(lowerCaseFindLocation)) {
      setIsError(true); 
      setSearchValue(`Can't find '${searchInput}' `); 
      setDirectionsValue(`Can't find '${searchInput}' `); 
    } else{
      setIsError(false); 
      setSearchValue("Search"); 
      setDirectionsValue(`Directions`); 
    }
  }
  
  const handleChange = (e) => {
    setSearchInput(e.target.value);
    setShowResults(true);
    setIsTyping(true);
    onChange(e.target.value);
    setIsError(false); 
    setSearchValue("Search");
    setDirectionsValue(`Directions`); 
  };

  const handleSelect = (location) => {
    if (location.name !== "") {
      const selectedValue = isRoom ? location.room : location.name;
      setSearchInput(selectedValue);
      setIsError(false); 
      onChange(selectedValue);
      setSearchValue("Search");
      setDirectionsValue(`Directions`); 
    }

    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (showResults && (e.keyCode === 9 || e.keyCode === 40)) {
      e.preventDefault();
      setSelectedIndex((selectedIndex + 1) % filteredLocations.length);
    } else if (e.keyCode === 13 && showResults && selectedIndex !== -1) {
      handleSelect(filteredLocations[selectedIndex]);
      setSelectedIndex(-1);
    } else if (e.keyCode === 38 && showResults) {
      e.preventDefault();
      if (selectedIndex === 0) {
        setSelectedIndex(filteredLocations.length - 1);
      } else {
        setSelectedIndex((selectedIndex - 1));
      }
    }
    setIsTyping(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchContainerRef]);

  let filteredLocations = points;
  if (points != null) {
    filteredLocations = points
      .filter((location) => (
        (searchInput === '' && showResults) ||
        (!isRoom && (searchInput !== '' && location.name.toLowerCase().includes(searchInput.toLowerCase()))) ||
        (isRoom && (searchInput !== '' && location.room.includes(searchInput)))
      ))
      .slice(0, MAX_RESULTS);
  }

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder={input}
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsTyping(false)}
          style={{ 
            width: `${inputWidth}px` , 
          }}
          className={`search-input${isTyping ? ' typing' : ''}`}
        />
        
        {!isRoom && (
          <div>
            <button className="arrow-icon" style={{ marginLeft: "-30px" }}>
              <FontAwesomeIcon icon={faArrowRight} />
              <div className="tooltip"
              style ={{
                color: Error ? "red" : "white"
              }}
              >{directionsValue}</div>
            </button>
            <button
              className="arrow-icon"
              style={{ 
                marginLeft: "-50px", 
              }}
              onClick={() => handleSearchButtonClick()} >
              <FontAwesomeIcon icon={faSearch} />
              <div className="search-icon-tooltip"
              style ={{
                color: Error ? "red" : "white"
              }}
              > 
              
              {searchValue}</div>
          </button>
          </div>
        )}
      </div>
      {showResults && (
        <ul className="search-results"
          style={{ width: isRoom ? "205px" : "300px" }}
        >
          {filteredLocations.map((location, index) => (
            <li
              key={index}
              className={selectedIndex === index ? "selected" : ""}
              onClick={() => handleSelect(location)}
            >
              {isRoom ? location.room : location.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
