import React, { useState } from "react";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const buildings = [
    { name: "Rozanski" },
    { name: "University Centre" },
    { name: "Mackinnon" }
  ];

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredBuildings = buildings.filter((building) => {
    return building.name.match(searchInput);
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Find a building"
        onChange={handleChange}
        value={searchInput}
      />
      <table>
        <thead>
          <tr>
            <th>Building</th>
          </tr>
        </thead>
        <tbody>
          {filteredBuildings.map((building, index) => {
            return (
              <tr key={index}>
                <td>{building.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SearchBar;
