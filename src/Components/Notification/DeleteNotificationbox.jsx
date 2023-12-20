import React from 'react'
import { toast } from 'react-toastify';
import { fireDb } from '../../../Firebase';
import { useSecondContext } from '../../Context/MyContext';
import styles from './Notification.module.css'

export default function DeleteNotificationbox() {
    const { deleteStory, setDeleteStory, homePageStates, setHomePageStates, profilePageStates, setProfilePageStates} = useSecondContext()

    const handleCancel = () => {
        setDeleteStory(({
            storyID: '',
            storyFolder: '',
            showDeleteBox: false,
        }))
    }

    const handleDelete = async () => {
        try {
            await fireDb.child(`story/${deleteStory.storyFolder}/${deleteStory.storyID}`).remove()
            const profileUpdatedStoriesList = profilePageStates[`${deleteStory.storyFolder}Stories`].filter(
                (story) => Object.keys(story)[0] !== deleteStory.storyID
              )
              setProfilePageStates(prev => ({
                ...prev,
                [`${deleteStory.storyFolder}Stories`]: profileUpdatedStoriesList
              }))
        
              if (deleteStory.storyFolder === 'public') {
                const homeUpdatedStoriesList = homePageStates['homeStories'].filter(
                  (story) => Object.keys(story)[0] !== deleteStory.storyID
                )
                setHomePageStates(prev => ({
                  ...prev,
                  homeStories: homeUpdatedStoriesList
                }))
              }
        
              setDeleteStory(({
                storyID: '',
                storyFolder: '',
                showDeleteBox: false,
            }))
            toast.success("Story removed")
        } catch (error) {
            toast.error("Sorry some error occured")
        }
    }

    return (
        <div className={styles.Container}>
            <div className={styles.Notificationbox}>
                <span>
                    <p>Do you really want to delete story?</p>
                    <div>
                        <button onClick={() => handleCancel()}>Cancel</button>
                        <button onClick={() => handleDelete()}>Yes</button>
                    </div>
                </span>
            </div>
        </div>
    )
}