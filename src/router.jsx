import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/main.css'

import Homepage from './pages/Homepage'
import Signin from './pages/Signin'
import User from './pages/User'

import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
    },
    {
        path: '/sign-in',
        element: <Signin />,
    },
    {
        path: '/user',
        element: <User />,
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    // Désactiver le mode strict en développement pour éviter la répétition des méthodes constructor(), render(), shouldComponentUpdate()
    //   <React.StrictMode>
    <RouterProvider router={router} />
    //   </React.StrictMode>
)
