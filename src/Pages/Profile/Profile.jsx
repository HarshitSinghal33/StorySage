import React, { useEffect, useState } from 'react'
import { fireDb } from '../../../Firebase'
import { useAuth } from '../../Context/AuthContext'
import Loader from '../../Components/Loader/Loader'
import Header from '../../Components/Header/Header'
import { Link, useParams } from 'react-router-dom'
import Footer from '../../Components/Footer/Footer'
import './Profile.css'
import { useSecondContext } from '../../Context/MyContext';
import useProfileStoriesHook from '../../hooks/useProfileStoriesHook'
import Story from '../../Components/Story/Story'
import ShareButton from '../../Components/ShareButton'
import DeleteNotificationbox from '../../Components/Notification/DeleteNotificationbox'
import BackToHeader from '../../Components/Header/BackToHeader'
import { toast } from 'react-toastify'

export default function Profile() {
  const { sageID } = useParams()
  const [isSageOnHisProfile, setIsSageOnHisProfile] = useState(false)
  const { fetchData } = useProfileStoriesHook()
  const { currentUser, logout } = useAuth()
  const { profilePageStates, setProfilePageStates, deleteStory } = useSecondContext();
  const { currentFolder, isLoading, sageName, sageBio, fetchedDataID } = profilePageStates;


  useEffect(() => {
    setIsSageOnHisProfile((!sageID || currentUser.uid === sageID) ? true : false)
    if (!profilePageStates[`is${currentFolder}StoriesFetched`]) {
      fetchData(sageID ? sageID : currentUser.uid, currentFolder)
    }
    if ((sageID && fetchedDataID !== sageID) || (!sageID && fetchedDataID !== currentUser.uid)) {
      handleUserData();
      handleFolderChange();
      return
    }
  }, [sageID, currentUser])

  const handleUserData = async () => {
    try {
      const snap = sageID ? await fireDb.child(`/Sage/${sageID}`).once('value') : await fireDb.child(`/Sage/${currentUser.uid}`).once('value')
      if (!snap.exists()) {
        setIsSageOnHisProfile('notFound')
        return
      }
      const userData = snap.val()
      setProfilePageStates(prev => ({
        ...prev,
        sageName: userData.name,
        sageBio: userData.bio,
        fetchedDataID: snap.key,
      }))
    } catch (error) {
      toast.error('Sorry some error occurred!, Please contact to developer.')
    }
  }

  const handleFolderChange = (folder) => {
    setProfilePageStates(prev => ({
      ...prev,
      currentFolder: folder ? folder : 'public'
    }))

    if (!profilePageStates[`is${folder}StoriesFetched`]) {
      fetchData(sageID ? sageID : currentUser.uid, folder ? folder : 'public')
    }
  }

  if (isSageOnHisProfile === 'notFound') {
    return (
      <>
        <BackToHeader path={''} />
        <h1 className='notFound'>The user you are searching is not Found 🙅
        </h1>
      </>

    )
  }

  return (
    <>
      <Header />
      <div className='UserDataBox'>

        <h1 className="name">
          <i>Author - {sageName}</i>
          <ShareButton url={sageID ? window.location.href : `${window.location.href}/${currentUser.uid}`} title={'Hey check out StorySage'} text={`Check out my profile named ${sageName} on storySage`} />
        </h1>

        <div className="bio">
          <p><i>{sageBio}</i></p>
        </div>

        {isSageOnHisProfile &&
          <div className='SageButton'>
            <Link to={'/editProfile'} className='settingBtn' >
              <div>Edit Profile</div>
            </Link>
            <div className='settingBtn' onClick={() => logout()}>Logout</div>
          </div>
        }
      </div>
      {/* ['public', ...(isSageOnHisProfile ? ['private', 'unlisted'] : [])] */}
      {isSageOnHisProfile &&
        <div className='storypathBox'>
          {['public', 'private', 'unlisted'].map(folder =>
            <div
              key={folder}
              className={`storypathButton ${currentFolder === folder && 'Active'}`}
              onClick={() => handleFolderChange(folder)}
            >
              {folder}
            </div>
          )}
        </div>
      }

      {isLoading && <Loader />}
      {profilePageStates[`${currentFolder}Stories`].length !== 0
        ? <Story stories={profilePageStates[`${currentFolder}Stories`]} isLoading={isLoading} isSage={isSageOnHisProfile} />
        :
        <div className='notFoundMessage'>
          <h1>No story found</h1>
        </div>
      }
      <Footer />
      {deleteStory.showDeleteBox && <DeleteNotificationbox />}
    </>
  )
}
