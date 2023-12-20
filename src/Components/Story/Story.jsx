import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../Loader/Loader'
import styles from './Story.module.css'
import EditStoryBtn from './EditStoryBtn';
import { useLocation } from 'react-router-dom';
export default function Story({ stories, isSage, isLoading }) {
    const [lastPath,setLastPath] = useState()
    const location = useLocation();
    useEffect(()=> {
        setLastPath(location.pathname === '/' ? 'home' : 'profile')
    },[location])
    return (
        <div className={styles.storyContainer}>
            {stories.map((value, i) => (
                <React.Fragment key={i}>
                    {Object.entries(value).map(([key, val]) => (
                        <div className={styles.storyBox} key={key}>
                            <Link to={`/ReadStory/${val.visibility}/${key}/${lastPath}`} >
                                {!isSage && <div className={styles.author}>Sage - Harshit</div>}
                                <h1 className={styles.title}>{val.title}</h1>
                                <p className={styles.story}>{val?.storySnap}</p>
                            </Link>
                            {isSage &&
                                <EditStoryBtn folder={val.visibility} storyID={key} />
                            }

                        </div>
                    ))}

                </React.Fragment>
            ))
            }
            {isLoading && <Loader Loaderheight={'9vh'} />}
        </div>
    )
}