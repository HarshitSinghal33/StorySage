import {Outlet, Navigate} from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
export const PrivateRoute =  () => {
    const {currentUser} =  useAuth()
    return(
        currentUser ? <Outlet/> : <Navigate to={'/login'}/> 
    )
}