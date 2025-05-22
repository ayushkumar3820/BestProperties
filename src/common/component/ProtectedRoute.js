import React from 'react'
import {Navigate, useLocation} from "react-router-dom"

const ProtectedRoute = ({children}) => {
    
    let location = useLocation();

    // if(!user.state.isAuthenticated) {
        return <Navigate to="/" state={{ from: location}} replace />
    // }
 return children

};

export default ProtectedRoute;