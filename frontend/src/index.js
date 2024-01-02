import React from 'react';
import ReactDOM from 'react-dom/client';
import PhotoSphere from './pages/navigation/index'
import GuelphMap from './pages/map';
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

const router = createBrowserRouter([
    {
        path: "/",
        element: <GuelphMap/>
    },
    {
        path: "nav", 
        element: <PhotoSphere/>
    },
    
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} /> 
);

