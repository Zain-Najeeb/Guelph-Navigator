import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PhotoSphere from './pages/navigation/index'
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';

export const locations = [
    { name: "Rozanski Hall" },
    { name: "University Centre" },
    { name: "Mackinnon" },
    { name: "Athletics Centre" },
    { name: "Macnaughton" },
  ];

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "nav", 
        element: <PhotoSphere/>
    }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} /> 
);

