import React, { useState, useRef, useEffect } from "react";
import './wheretoBar.css';

const SearchBar = ({ input, onChange }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const locations = [
    { name: "Rozanski Hall" },
    { name: "University Centre" },
    { name: "Mackinnon" },
    { name: "Athletics Centre" },
    { name: "Macnaughton" },
  ];

  const searchContainerRef = useRef();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    setShowResults(true);
    setIsTyping(true);
    onChange(e.target.value); 
  };

  const handleSelect = (location) => {
    if (location.name === "" && searchInput === "") {
      setShowResults(true);
    } else {
      setSearchInput(location.name);
      onChange(location.name); 
      setShowResults(false);
    }
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

  const filteredLocations = locations.filter((location) => {
    return (
      (searchInput === '' && showResults) ||
      (searchInput !== '' && location.name.toLowerCase().includes(searchInput.toLowerCase()))
    );
  });

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
        type="text"
        placeholder={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsTyping(false)}
        value={searchInput}
        className={`search-input${isTyping ? ' typing' : ''}`}
      />
      {showResults && (
        <ul className="search-results">
          {filteredLocations.map((location, index) => {
            return (
              <li
                key={index}
                className={selectedIndex === index ? "selected" : ""}
                onClick={() => handleSelect(location)}
              >
                {location.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
