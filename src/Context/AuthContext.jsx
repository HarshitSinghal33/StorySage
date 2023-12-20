import React, { useContext, useEffect, useState, createContext } from 'react'
import { auth } from '../../Firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth'
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

    async function signup(email, password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(userCredential.user);
        console.log('email sent');
        // .then((userCredential) => {
        //      fireDb.child(`users/${userCredential.user.uid}`).set({email: email})
        // })
    }

    function googleSignUp() {
        const googleAuthProvider = new GoogleAuthProvider
        return signInWithRedirect(auth, googleAuthProvider)
    }
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }
    function changepassword(email) {
        return sendPasswordResetEmail(auth, email)
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,async (user) => {
            if (user) {
                const isNewUser = await fireDb.child(`Sage/${user.uid}`).get()
                
                const providers = user.providerData.map((provider) => provider.providerId);
                if (!isNewUser.exists() && providers.includes('google.com')) {
                    const displayName = user.displayName;
                    try {
                        await fireDb.child(`/Sage/${auth.currentUser.uid}`).set({
                            name: displayName,
                            about: `Hey I am sage ${displayName}`
                          })
                    } catch (error) {
                        toast.error('sorry some error found');
                    }
                }
            }
            // console.log(user?.uid);
            setCurrentUser(user)
            setLoading(false)
        })
        return () => { unsubscribe() }
    }, [])
    // console.log(currentUser);
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}
