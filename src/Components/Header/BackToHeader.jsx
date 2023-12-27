import React from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import styles from './Header.module.css'

export default function BackToHeader({ path }) {// this Header is for readstory and the path prop here is the page we came from
    return (
        <header className={styles.backToHeader}>
            <Link to={`/${path}`}>
                <h1><FaArrowLeft className='icon'/></h1>
            </Link>
            <div><h2>Back to {path ? path : 'Home'}</h2></div>
        </header>
    )
}