import React, { useState, useRef, useEffect } from "react";
import './wheretoBar.css';

import { locations } from './../index';
import { rooms } from './../index'
import {codes } from './../index'
const MAX_RESULTS = 6;

export const SearchBar = ({ input, onChange, isRoom, building}) => {
  const [searchInput, setSearchInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputWidth = isRoom ? 200 : 300;
  const points = isRoom ? rooms[building] : locations
  const searchContainerRef = useRef();
  const handleChange = (e) => {
    setSearchInput(e.target.value);
    setShowResults(true);
    setIsTyping(true);
    onChange(e.target.value);
    if (e.target.value in codes && !isRoom) {
      setSearchInput(codes[e.target.value]);
      onChange(codes[e.target.value]);
    }
  };

  const handleSelect = (location) => {
    if (location.name !== "") {
      const selectedValue = isRoom ? location.room : location.name;
      setSearchInput(selectedValue);
      onChange(selectedValue);
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
        (!isRoom && (searchInput !== '' && location.name.toLowerCase().includes(searchInput.toLowerCase().trim()))) ||
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
        
        {/* {!dirBool && (
        )} */}
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
