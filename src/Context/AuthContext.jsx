import React, { useContext, useEffect, useState, createContext } from 'react'
import { auth } from '../../Firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider,  signInWithRedirect } from 'firebase/auth'
import { fireDb } from '../../Firebase'
import { toast } from 'react-toastify'

const AuthContext = createContext()
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const value = { currentUser, signup, login, logout, changepassword, googleSignUp }

    async function signup(name, email, password) {
        // const userCredential = 
        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            fireDb.child(`sage/${userCredential.user.uid}/userProfileData`).set({
                name: name,
                bio: `Hey I am sage ${name}`
            })
        })

        // For email verification (for now i want to share story that's why I think it's may effect user experience)
        // await sendEmailVerification(userCredential.user);
        // console.log('email sent');
    }

    function googleSignUp() {
        const googleAuthProvider = new GoogleAuthProvider
        return signInWithRedirect(auth, googleAuthProvider)
    }

    async function login(email, password) {
        return await signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    async function changepassword(email) {
        return await sendPasswordResetEmail(auth, email)
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {// for signup with googleSignup button
                const isNewUser = await fireDb.child(`sage/${user.uid}/userProfileData`).get()
                const providers = user.providerData.map((provider) => provider.providerId);
                if (!isNewUser.exists() && providers.includes('google.com')) {
                    const displayName = user.displayName;
                    try {
                        await fireDb.child(`/sage/${auth.currentUser.uid}/userProfileData`).set({
                            name: displayName,
                            bio: `Hey I am sage ${displayName}`
                        })
                    } catch (error) {
                        toast.error('An error occurred, please contact to developer');
                    }
                }
            }
            setCurrentUser(user)
            setLoading(false)
        })
        
        return () => { unsubscribe() }
    }, [])
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}