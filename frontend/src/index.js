import React from 'react';
import ReactDOM from 'react-dom/client';
import PhotoSphere from './pages/navigation/index'
import GuelphMap from './pages/map';
import Testing from './pages/testing';
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';

export const locations = [
    { name: "Rozanski Hall"},
    { name: "University Centre" },
    { name: "Mackinnon" },
    { name: "Athletics Centre" },
    { name: "Macnaughton" },
    { name: "Thornbrough"}, 
    { name: "Summerlee Science Complex"}
  ];

export const codes = {
    "rozh": "Rozanski Hall",
    "uc": "University Centre",
    "mckn": "Mackinnon",
    "ac": "Athletics Centre",
    "macn": "Macnaughton",
    "thrn": "Thornbrough",
    "ssc": "Summerlee Science Complex"
}
export const rooms = {
    "rozanski hall": [
        {room: "101"}, 
        {room: "102"}, 
        {room: "103"}, 
        {room: "104"}, 
        {room: "105"},
        {room: "106"}, 
        {room: "107"}, 
        {room: "108"}, 
        {room: "109"}
    ],
    "the cannon" : []
}

export const cords = {
    "rozanski hall": [ -80.22612741818148,43.53213609056374] 
}

export const lowerToUpper = {
    "rozanski hall": "Rozanski Hall",
    "thornbrough building": "Thornbrough Building",
    "alexander hall": "Alexander Hall",
    "crop science building": "Crop Science Building",
    "rutherford family conservatory": "Rutherford Family Conservatory",
    "powell building": "Powell Building",
    "johnston hall": "Johnston Hall",
    "landscape architecture": "Landscape Architecture",
    "mackinnon building": "MacKinnon Building",
    "macnaughton building": "MacNaughton Building",
    "macdonald hall": "Macdonald Hall",
    "macdonald institute": "Macdonald Institute",
    "macdonald steward hall": "Macdonald Steward Hall",
    "massey hall": "Massey Hall",
    "mclaughlin library": "McLaughlin Library",
    "reynolds building": "Reynolds Building",
    "richards building": "Richards Building",
    "summerlee science complex": "Summerlee Science Complex",
    "war memorial hall": "War Memorial Hall",
    "zavitz hall": "Zavitz Hall",
    "athletics centre": "Athletics Centre",
    "university centre": "University Centre",
    "maclachlan building": "MacLachlan Building",
    "the cannon": "The Cannon"
};


const router = createBrowserRouter([
    {
        path: "/",
        element: <GuelphMap/>
    },
    {
        path: "nav", 
        element: <PhotoSphere/>
    },
    {
        path: "testing", 
        element: <Testing/>
    },
    
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} /> 
);

