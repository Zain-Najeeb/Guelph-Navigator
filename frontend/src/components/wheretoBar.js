import React, { useState } from "react";
import "./wheretoBar.css";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const locations = [
    { name: "Rozanski" },
    { name: "University Centre" },
    { name: "Mackinnon" }
  ];

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleLocationClick = (name) => {
    setSearchInput(name);
  };

  const filteredLocations = locations.filter((location) => {
    return (
      searchInput !== "" &&
      location.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  });

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Find a location"
        onChange={handleChange}
        value={searchInput}
        className="search-input"
      />
      <ul className="search-results">
        {filteredLocations.map((location, index) => {
          return (
            <li
              key={index}
              className="search-result-item"
              onClick={() => handleLocationClick(location.name)}
            >
              {location.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchBar;
