import {Outlet, Navigate} from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
//the private route is create to prevent user if not loggedIn from updateStory and editProfile
export const PrivateRoute =  () => {
    const {currentUser} =  useAuth()
    return(
        currentUser ? <Outlet/> : <Navigate to={'/login'}/> 
    )
}