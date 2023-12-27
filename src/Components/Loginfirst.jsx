import React from 'react'
import { Link } from 'react-router-dom'

// This component will show the message of login if user is not loggedIn or there is no sageID in link
export default function Loginfirst({visit}) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center',alignItems:'center',height:'75vh' }}>
            <h2 className='LoginFirst'> <Link to={'/login'} style={{ color: 'var(--button-color)' }}> Login </Link> <span> To {visit} </span></h2>
        </div>
    )
}
