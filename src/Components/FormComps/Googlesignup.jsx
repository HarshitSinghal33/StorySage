import React, { useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import styles from './GoogleSignup.module.css';
import { toast } from 'react-toastify';
export default function Googlesignup() {
    const navigate = useNavigate()
    const { googleSignUp, currentUser } = useAuth()

    useEffect(() => {
        if (currentUser) {
            navigate('/profile');
        }
    }, [currentUser])


    const handleGoogleSignIn = async (e) => {
        e.preventDefault()
        try {
            await googleSignUp()
        } catch (error) {
            toast.error('SOme error occurred!, please contact to developer.')
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