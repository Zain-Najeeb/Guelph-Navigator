import { getBuildings } from "../connections.js"; 
import React, { useEffect, useState } from 'react';

const Testing = () => {
    const [buildings, setBuildings] = useState([]);
    const [spot, setSpot] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assuming getBuildings is an asynchronous function
                const buildingData = await getBuildings();
                setBuildings(buildingData);
            } catch (error) {
                console.error('Error fetching building data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
        <h1>Building list</h1>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Abbreviation</th>
                    <th>Element ID</th>
                </tr>
            </thead>
            <tbody>
                {buildings.map((building, index) => (
                <tr key={index}>
                    <td>{building.name}</td>
                    <td>{building.abbreviation}</td>
                    <td>{building.id}</td>
                </tr>
                ))}
            </tbody>
        </table>
        </>
        
    );
}; 
export default Testing; 