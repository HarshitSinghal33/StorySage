import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsFillPersonFill } from 'react-icons/bs'
import { FaPlus, FaHome } from 'react-icons/fa'
import styles from './Footer.module.css'
export default function Footer() {
    const [currentPage, setCurrentPage] = useState();
    const { pathname } = useLocation()

    // to know in which page we are in
    useEffect(() => {
        pathname.includes('') && setCurrentPage('home');
        pathname.toLocaleLowerCase().includes('story') && setCurrentPage('story');
        pathname.toLocaleLowerCase().includes('profile') && setCurrentPage('profile');
    }, [])
    
    return (
        <div className={styles.footerContainer}>
            <footer className={styles.footer}>
                <div>
                    <h2><Link to="/" >
                        <FaHome className={currentPage === 'home' ? `${styles.icon} ${styles.Active}` : `${styles.icon}`} />
                    </Link></h2>
                    <h2><Link to='/CreateStory' title='Share your story'>
                        <FaPlus className={currentPage === 'story' ? `${styles.icon} ${styles.Active}` : `${styles.icon}`} />
                    </Link></h2>
                    <h2><Link to="/Profile" title='Profile'>
                        <BsFillPersonFill className={currentPage === 'profile' ? `${styles.icon} ${styles.Active}` : `${styles.icon}`} />
                    </Link></h2>
                </div>
            </footer>
        </div>

    )
}
