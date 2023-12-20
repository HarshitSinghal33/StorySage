import React, { useState, useEffect } from 'react'
import { fireDb } from '../../../Firebase'
import { useParams, Link } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BackToHeader from '../../Components/Header/BackToHeader';
import ShareButton from '../../Components/ShareButton';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';
// it's css in App.css

export default function Readstory() {
    const {currentUser} = useAuth()
    const [story, setStory] = useState()
    const { storyFolder, storyID, lastPath } = useParams()
    useEffect(() => {
        handleStoryData()
    }, [currentUser])

    const handleStoryData = async () => {
        try {
            const snapShot = await fireDb.child(`story/${storyFolder}/${storyID}`).once('value')
            if (storyFolder === 'private' && snapShot.val().userID !== currentUser?.uid || !snapShot.exists() ) {
                setStory(false)
                return
            }
            setStory(snapShot.val())
        } catch (error) {
            toast.error('Sorry Some error occurred in fetching data! Contact to developer!')
        }
    }
    return (
        <>
            <BackToHeader path={lastPath === 'home' || !lastPath ? '' : lastPath} />
            {story
                ?
                <div className='readStory'>
                    <header>
                        <Link to={`/profile/${story.userID}`}>
                            <h3>Sage - {story?.name}</h3>
                            <h3>Created - {story?.date}</h3>
                        </Link>
                        <div>
                            <ShareButton title={`Hey! Read my Story at story telling platform StorySage platform`}
                                text={`Check out my story, ${story.title}`}
                                url={window.location.href} />
                        </div>
                    </header>
                    <h1 className="title">{story.title}</h1>
                    <ReactQuill value={story.story} readOnly modules={{ toolbar: false }} className='fullStory' />
                </div>
                : <h1 className='notFound'> No story found</h1>
            }
        </>

    )
}
