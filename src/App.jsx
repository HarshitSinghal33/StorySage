import React from 'react';

// Contexts
import { AuthProvider } from './Context/AuthContext';
import { SecondProvider } from './Context/MyContext';

// Components
import { PrivateRoute } from './Components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Pages
import Home from './Pages/Home';
import Signup from './Pages/Account/Signup';
import Login from './Pages/Account/Login';
import Changepassword from './Pages/Account/Changepassword';
import UpdateStory from './Pages/CRUD_Story/UpdateStory';
import Profile from './Pages/Profile/Profile';
import Readstory from './Pages/CRUD_Story/Readstory';
import Editprofile from './Pages/Profile/Editprofile';
import CreateStory from './Pages/CRUD_Story/CreateStory';

// CSS
import './App.css';
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={2400} />
      <AuthProvider>
        <SecondProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path='/CreateStory' element={<CreateStory />} />
              <Route path='/updateStory/:storyFolder/:storyId' element={<UpdateStory />} />
              <Route path='/profile/:sageID?' element={<Profile />} />
              <Route path='/editProfile' element={<Editprofile />} />
            </Route>
            <Route path='/Readstory/:storyFolder/:storyID/:lastPath?' element={<Readstory />} />
            
            <Route path='/Changepassword' element={<Changepassword />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/Login' element={<Login />} />
          </Routes>
        </SecondProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
