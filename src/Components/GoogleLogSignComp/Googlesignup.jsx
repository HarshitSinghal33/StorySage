import React, { useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './GoogleSignup.module.css';

export default function Googlesignup() {
    const { googleSignUp,currentUser } = useAuth()

    // if currentUser than navigate to profile
    useEffect(()=>{
       currentUser && navigate('/profile')
    },[currentUser])

    const navigate = useNavigate()
    const handleGoogleSignIn = async (e) => {
        e.preventDefault()
        try {
            await googleSignUp()
        } catch (error) {
            toast.error('An error occurred!, please contact to developer.')
        }
    }
    return (
        <div onClick={(e) => handleGoogleSignIn(e)}
            className={`${styles.google}`}>
            <FcGoogle className={styles.googleIcon} />
            <span>Login with Google</span>
        </div>
    )
}