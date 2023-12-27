import React from 'react';
import ReactDom from 'react-dom';
import { toast } from 'react-toastify';
import { fireDb } from '../../../Firebase';
import { useSecondContext } from '../../Context/MyContext';
import { useAuth } from '../../Context/AuthContext';
import styles from './Modal.module.css'

export default function DeleteModal({ onClose, folder, storyID }) {
    const { currentUser } = useAuth()
    const { homePageStates, setHomePageStates, profilePageStates, setProfilePageStates } = useSecondContext()

    const handleDelete = async () => {
        try {
            // remove the story from the feed
            await fireDb.child(folder === 'public' ? `publicstories/${storyID}` : `sage/${currentUser.uid}/${folder}stories/${storyID}`).remove()

            // filter out the story from profile feed 
            const profileUpdatedStoriesList = profilePageStates[`${folder}Stories`].filter(
                (story) => Object.keys(story)[0] !== storyID
            )
            setProfilePageStates(prev => ({
                ...prev,
                [`${folder}Stories`]: profileUpdatedStoriesList
            }))

            // if feed is public means it may in hHome page so also filter that out.
            if (folder === 'public') {
                const homeUpdatedStoriesList = homePageStates['homeStories'].filter(
                    (story) => Object.keys(story)[0] !== storyID
                )
                setHomePageStates(prev => ({
                    ...prev,
                    homeStories: homeUpdatedStoriesList
                }))
            }

            toast.success("Story removed")
        } catch (error) {
            toast.error("An error occurred!, Please contact to developer")
        }
    }


    // Component creates a portal using createPortal and renders its children into a div with the id modal-root, which is expected to exist in the HTML outside the React app's root element.
    return ReactDom.createPortal(
        <>
            <div className={styles.overLay}></div>
            <div className={styles.modal}>
                <b>
                    <p>Once you delete your story you can't recover it again. Don't you really want to delete Story?</p>
                </b>
                <div className={styles.btns}>
                    <div onClick={onClose}>Cancel</div>
                    <div onClick={() => handleDelete()}>Yes</div>
                </div>
            </div>
        </>, document.getElementById('portal')
    )
}